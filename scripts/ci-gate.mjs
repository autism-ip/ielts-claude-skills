#!/usr/bin/env node
/**
 * [INPUT]: 依赖 Node.js fs/path/process 的只读仓库扫描能力。
 * [OUTPUT]: 对外提供 `node scripts/ci-gate.mjs` 门禁命令，验证 skill、文档、workflow、未来 v3 package 契约。
 * [POS]: scripts 的核心 CI 门禁执行器，被 GitHub Actions 与本地开发者共同调用。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const failures = [];

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".pnpm-store",
  "dist",
  "build",
  "coverage",
]);

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function at(relativePath) {
  return path.join(ROOT, relativePath);
}

function has(relativePath) {
  return existsSync(at(relativePath));
}

function dirHasFiles(relativePath) {
  const dir = at(relativePath);
  return isDir(dir) && walk(dir).length > 0;
}

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return readFileSync(at(relativePath), "utf8");
}

function list(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort();
}

function isDir(file) {
  return existsSync(file) && lstatSync(file).isDirectory();
}

function walk(dir, files = []) {
  for (const name of list(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const file = path.join(dir, name);
    if (isDir(file)) {
      walk(file, files);
    } else {
      files.push(file);
    }
  }
  return files;
}

function findSkillFiles() {
  const roots = [ROOT, at("skills")].filter(isDir);
  const files = [];

  for (const root of roots) {
    for (const name of list(root)) {
      const skillFile = path.join(root, name, "SKILL.md");
      if (existsSync(skillFile)) files.push(skillFile);
    }
  }

  return [...new Set(files)].sort();
}

function parseFrontmatter(file, text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    fail(`${rel(file)}: missing YAML frontmatter`);
    return null;
  }

  const yaml = match[1];
  const name = yaml.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const hasDescription = /^description:\s*(?:.+|\|)/m.test(yaml);
  const version = yaml.match(/metadata:\n(?:\s+[^\n]*\n)*?\s+version:\s*([0-9]+\.[0-9]+\.[0-9]+)/m)?.[1];

  if (!name) fail(`${rel(file)}: frontmatter missing name`);
  if (!hasDescription) fail(`${rel(file)}: frontmatter missing description`);
  if (!version) fail(`${rel(file)}: metadata.version must be semver`);
  if (!/^\s*#\s+/.test(text.slice(match[0].length))) {
    fail(`${rel(file)}: missing first H1 after frontmatter`);
  }

  return { name, text, version, file };
}

function validateSkills() {
  const files = findSkillFiles();
  if (files.length === 0) {
    fail("No SKILL.md files found");
    return [];
  }

  const skills = files.map((file) => parseFrontmatter(file, readFileSync(file, "utf8"))).filter(Boolean);
  const names = new Map();

  for (const skill of skills) {
    const folder = path.basename(path.dirname(skill.file));
    if (skill.name && folder !== skill.name) {
      fail(`${rel(skill.file)}: folder name must match skill name "${skill.name}"`);
    }

    if (names.has(skill.name)) {
      fail(`${rel(skill.file)}: duplicate skill name "${skill.name}" also in ${rel(names.get(skill.name))}`);
    }
    names.set(skill.name, skill.file);
  }

  validateRouterSkill(skills);
  validateReadmeReferences(skills);
  return skills;
}

function validateRouterSkill(skills) {
  const router = skills.find((skill) => skill.name === "ielts");
  if (!router) {
    fail("Missing root router skill named ielts");
    return;
  }

  for (const skill of skills) {
    if (skill.name === "ielts") continue;
    if (!router.text.includes(`/${skill.name}`)) {
      fail(`${rel(router.file)}: router does not reference /${skill.name}`);
    }
  }
}

function validateReadmeReferences(skills) {
  if (!has("README.md")) {
    fail("README.md is required");
    return;
  }

  const readme = read("README.md");
  for (const skill of skills) {
    if (!readme.includes(skill.name)) {
      fail(`README.md: missing skill name ${skill.name}`);
    }
    if (!readme.includes(`/${skill.name}`)) {
      fail(`README.md: missing command /${skill.name}`);
    }
  }
}

function validateWorkflow() {
  const workflowPath = ".github/workflows/ci.yml";
  if (!has(workflowPath)) {
    fail(`${workflowPath}: missing GitHub Actions CI gate`);
    return;
  }

  const workflow = read(workflowPath);
  const required = [
    "pull_request:",
    "push:",
    "workflow_dispatch:",
    "permissions:",
    "contents: read",
    "node scripts/ci-gate.mjs",
  ];

  for (const token of required) {
    if (!workflow.includes(token)) {
      fail(`${workflowPath}: missing ${token}`);
    }
  }
}

function validateGebDocs(skillFiles) {
  if (!has("CLAUDE.md")) fail("CLAUDE.md: missing L1 project map");

  const moduleDirs = new Set([
    ".github",
    ".github/workflows",
    "docs",
    "scripts",
    ...skillFiles.map((file) => rel(path.dirname(file))),
  ]);

  for (const dir of [...moduleDirs].sort()) {
    if (!has(`${dir}/CLAUDE.md`)) {
      fail(`${dir}/CLAUDE.md: missing L2 module map`);
      continue;
    }

    const doc = read(`${dir}/CLAUDE.md`);
    if (!doc.includes("[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md")) {
      fail(`${dir}/CLAUDE.md: missing fixed GEB protocol line`);
    }
  }
}

function validateL3Headers() {
  const contractExtensions = new Set([".js", ".mjs", ".ts", ".tsx", ".jsx", ".yml", ".yaml", ".py"]);
  const scopedPrefixes = ["scripts/", ".github/", "packages/"];

  for (const file of walk(ROOT)) {
    const relative = rel(file);
    const ext = path.extname(file);
    if (!contractExtensions.has(ext)) continue;
    if (!scopedPrefixes.some((prefix) => relative.startsWith(prefix))) continue;

    const head = readFileSync(file, "utf8").split("\n").slice(0, 12).join("\n");
    for (const token of ["[INPUT]", "[OUTPUT]", "[POS]", "[PROTOCOL]"]) {
      if (!head.includes(token)) fail(`${relative}: missing L3 ${token} header`);
    }
  }
}

function validateHygiene() {
  const forbidden = [".DS_Store", "__pycache__", "node_modules"];
  for (const file of walk(ROOT)) {
    const parts = rel(file).split("/");
    for (const name of forbidden) {
      if (parts.includes(name) || parts.at(-1) === name) {
        fail(`${rel(file)}: forbidden generated artifact`);
      }
    }
  }
}

function validateSizeBudgets() {
  const skip = new Set(["LICENSE", "pnpm-lock.yaml", "package-lock.json", "yarn.lock"]);
  for (const file of walk(ROOT)) {
    const relative = rel(file);
    if (skip.has(relative) || relative.endsWith(".lock")) continue;

    const lineCount = readFileSync(file, "utf8").split("\n").length;
    if (lineCount > 800) {
      fail(`${relative}: ${lineCount} lines exceeds 800-line file budget`);
    }
  }

  for (const dir of collectDirs(ROOT)) {
    const fileCount = list(dir).filter((name) => !isDir(path.join(dir, name))).length;
    if (fileCount > 8) {
      fail(`${rel(dir) || "."}: ${fileCount} files exceeds 8-file directory budget`);
    }
  }
}

function collectDirs(dir, dirs = []) {
  dirs.push(dir);
  for (const name of list(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const file = path.join(dir, name);
    if (isDir(file)) collectDirs(file, dirs);
  }
  return dirs;
}

function validatePackageGates() {
  const hasPackage = has("package.json");
  const hasV3Workspace = hasPackage
    || dirHasFiles("packages")
    || has("pnpm-workspace.yaml")
    || has(".claude-plugin/plugin.json");
  if (!hasV3Workspace) return;

  if (!hasPackage) {
    fail("v3 workspace markers found but package.json is missing");
    return;
  }

  const pkg = JSON.parse(read("package.json"));
  const scripts = pkg.scripts || {};
  if (!scripts.test) fail("package.json: v3 workspace must expose scripts.test");

  if (has("pnpm-workspace.yaml") && !String(pkg.packageManager || "").startsWith("pnpm@")) {
    fail("package.json: pnpm-workspace.yaml requires packageManager pnpm@...");
  }

  if (has(".claude-plugin/plugin.json")) {
    const plugin = JSON.parse(read(".claude-plugin/plugin.json"));
    if (!plugin.name) fail(".claude-plugin/plugin.json: missing name");
    if (!plugin.version) fail(".claude-plugin/plugin.json: missing version");
  }
}

function validateIssueTraceability() {
  const docPath = "docs/CI_CD_GATES.md";
  if (!has(docPath)) {
    fail(`${docPath}: missing issue-to-gate traceability doc`);
    return;
  }

  const doc = read(docPath);
  for (const token of ["ZEN-64", "#15", "ZEN-51", "ZEN-61"]) {
    if (!doc.includes(token)) fail(`${docPath}: missing traceability token ${token}`);
  }
}

const skillFiles = findSkillFiles();
validateSkills();
validateWorkflow();
validateGebDocs(skillFiles);
validateL3Headers();
validateHygiene();
validateSizeBudgets();
validatePackageGates();
validateIssueTraceability();

if (failures.length > 0) {
  console.error("CI gate failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`CI gate passed: ${skillFiles.length} skill(s), workflow, GEB docs, and package contract validated.`);
