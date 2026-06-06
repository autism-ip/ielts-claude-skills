/**
 * [INPUT]: 依赖 node:fs, node:os, node:path, node:child_process 的系统检查
 * [OUTPUT]: 对外提供 doctorCommand 函数，诊断 IELTS 安装健康状态
 * [POS]: packages/cli 的诊断命令，被 index.ts 注册为 `ielts doctor`
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { existsSync, readFileSync, accessSync, constants, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const BASE = join(homedir(), '.ielts');
const SKILLS_DIR = join(homedir(), '.claude', 'skills');
const REQUIRED_SKILLS = ['ielts', 'ielts-writing', 'ielts-reading', 'ielts-speaking', 'ielts-listening', 'ielts-vocab', 'ielts-diagnose', 'ielts-dashboard'];
const MODULE_DIRS = ['writing', 'reading', 'listening', 'speaking', 'vocab', 'diagnosis'];

type Result = { status: 'pass' | 'warn' | 'fail'; message: string; hint?: string };

function check(condition: boolean, passMsg: string, failMsg: string, hint?: string): Result {
  return condition ? { status: 'pass', message: passMsg } : { status: 'fail', message: failMsg, hint };
}

function checkNodeVersion(): Result {
  const v = process.versions.node;
  const major = parseInt(v.split('.')[0], 10);
  return check(major >= 18, `Node.js ${v} (>= 18)`, `Node.js ${v} (< 18)`, `Install Node.js >= 18: https://nodejs.org`);
}

function checkPnpm(): Result {
  try {
    const out = execSync('pnpm --version', { encoding: 'utf-8', timeout: 5000 }).trim();
    return { status: 'pass', message: `pnpm ${out}` };
  } catch {
    return { status: 'warn', message: 'pnpm not found in PATH', hint: 'Install pnpm: npm install -g pnpm' };
  }
}

function checkCLIBuild(): Result {
  const distUrl = new URL('../index.js', import.meta.url);
  const distPath = distUrl.pathname;
  if (!existsSync(distPath)) return { status: 'fail', message: 'CLI dist not built', hint: 'Run: pnpm build' };
  const built = statSync(distPath).mtime;
  return { status: 'pass', message: `CLI built (${built.toISOString().slice(0, 10)})` };
}

function checkIeltsDir(): Result {
  if (!existsSync(BASE)) {
    return { status: 'fail', message: '~/.ielts/ not found', hint: 'Run: ielts init' };
  }
  try { accessSync(BASE, constants.W_OK); } catch {
    return { status: 'fail', message: '~/.ielts/ not writable', hint: 'Fix permissions: chmod -R u+w ~/.ielts' };
  }
  return { status: 'pass', message: '~/.ielts/ exists and writable' };
}

function checkProfile(): Result {
  const p = join(BASE, 'profile.json');
  if (!existsSync(p)) return { status: 'fail', message: 'profile.json missing', hint: 'Run: ielts init' };
  try {
    const data = JSON.parse(readFileSync(p, 'utf-8'));
    const hasTarget = data.target && typeof data.target.overall === 'number';
    return check(hasTarget, 'profile.json valid', 'profile.json missing required fields', 'Fix or delete ~/.ielts/profile.json and re-run ielts init');
  } catch {
    return { status: 'fail', message: 'profile.json invalid JSON', hint: 'Fix or delete ~/.ielts/profile.json' };
  }
}

function checkStats(): Result {
  const p = join(BASE, 'stats.json');
  if (!existsSync(p)) return { status: 'warn', message: 'stats.json missing', hint: 'Run: ielts snapshot' };
  try {
    JSON.parse(readFileSync(p, 'utf-8'));
    return { status: 'pass', message: 'stats.json valid' };
  } catch {
    return { status: 'warn', message: 'stats.json invalid JSON', hint: 'Run: ielts snapshot' };
  }
}

function checkModuleDirs(): Result {
  const missing = MODULE_DIRS.filter(d => !existsSync(join(BASE, d)));
  if (missing.length === 0) return { status: 'pass', message: `All ${MODULE_DIRS.length} module dirs present` };
  return { status: 'warn', message: `Missing dirs: ${missing.join(', ')}`, hint: 'Run: ielts init' };
}

function checkSkills(): Result {
  let pass = 0, fail = 0, missing: string[] = [];
  for (const skill of REQUIRED_SKILLS) {
    const skillPath = join(SKILLS_DIR, skill);
    if (existsSync(skillPath)) {
      pass++;
    } else {
      fail++; missing.push(skill);
    }
  }
  if (fail === 0) return { status: 'pass', message: `All ${pass}/8 skills installed` };
  return { status: 'warn', message: `${pass}/8 skills OK, ${fail} missing: ${missing.join(', ')}`, hint: 'Copy skills/ to ~/.claude/skills/' };
}

function checkFeishu(): Result {
  const p = join(BASE, 'secrets.json');
  if (!existsSync(p)) return { status: 'pass', message: 'Feishu not configured (optional)' };
  try {
    const data = JSON.parse(readFileSync(p, 'utf-8'));
    if (data.app_id && data.app_secret) return { status: 'pass', message: 'Feishu configured (secrets OK)' };
    return { status: 'warn', message: 'Feishu secrets incomplete', hint: 'Run: ielts cloud setup' };
  } catch {
    return { status: 'warn', message: 'Feishu secrets.json malformed', hint: 'Remove ~/.ielts/secrets.json and re-run ielts cloud setup' };
  }
}

function color(status: string, text: string): string {
  if (status === 'pass') return `\x1b[32m✓ ${text}\x1b[0m`;
  if (status === 'fail') return `\x1b[31m✗ ${text}\x1b[0m`;
  return `\x1b[33m⚠ ${text}\x1b[0m`;
}

export function doctorCommand(): void {
  const results: Result[] = [
    checkNodeVersion(),
    checkPnpm(),
    checkCLIBuild(),
    checkIeltsDir(),
    checkProfile(),
    checkStats(),
    checkModuleDirs(),
    checkSkills(),
    checkFeishu(),
  ];

  let passed = 0, warned = 0, failed = 0;
  console.log('\n  IELTS Doctor — System Diagnostics\n');

  for (const r of results) {
    if (r.status === 'pass') passed++;
    else if (r.status === 'warn') warned++;
    else failed++;
    console.log(`  ${color(r.status, r.message)}`);
    if (r.hint) console.log(`         ${r.hint}`);
  }

  const total = results.length;
  console.log(`\n  ${passed}/${total} passed, ${warned} warnings, ${failed} failures`);
  if (failed > 0) console.log('\n  ❌ Some checks failed — see hints above');
  process.exit(failed > 0 ? 1 : 0);
}
