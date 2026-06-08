#!/usr/bin/env node

/**
 * [INPUT]: 依赖 child_process 执行 CLI 命令
 * [OUTPUT]: 对外提供 smoke test 入口，验证构建→测试→夹具→快照→Dashboard 全链路
 * [POS]: scripts/ 的冒烟测试脚本，发布前运行
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

let exitCode = 0;
const start = Date.now();
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
let tmpDir = null;

function step(name, fn) {
  const s = Date.now();
  try {
    fn();
    const elapsed = Date.now() - s;
    console.log(`  \u2705 ${name} (${elapsed}ms)`);
  } catch (e) {
    exitCode = 1;
    const msg = e.stderr?.toString().trim() || e.message;
    console.log(`  \u274c ${name}`);
    console.log(`     ${msg.split('\n')[0]}`);
  }
}

console.log('\n  IELTS v3.1 Smoke Test\n');

/* Step 1: Build workspace */
step('pnpm build', () => {
  execSync('pnpm build', { cwd: ROOT, stdio: 'pipe', timeout: 120000 });
});

/* Step 2: Run tests */
step('pnpm test', () => {
  execSync('pnpm test', { cwd: ROOT, stdio: 'pipe', timeout: 60000 });
});

/* Step 3: Install fixtures in temp dir */
step('ielts init --fixtures', () => {
  tmpDir = mkdtempSync(join(tmpdir(), 'ielts-smoke-'));
  const env = { ...process.env, HOME: tmpDir, USERPROFILE: tmpDir };
  execSync('node packages/cli/dist/index.js init --fixtures', {
    cwd: ROOT, stdio: 'pipe', timeout: 10000, env,
  });
  const base = join(tmpDir, '.ielts');
  if (!existsSync(join(base, 'profile.json'))) throw new Error('profile.json missing');
  if (!existsSync(join(base, 'stats.json'))) throw new Error('stats.json missing');
  if (!existsSync(join(base, 'writing'))) throw new Error('writing/ missing');
});

/* Step 4: Generate snapshot */
step('ielts snapshot', () => {
  if (!tmpDir) throw new Error('skip: fixture setup failed');
  const env = { ...process.env, HOME: tmpDir, USERPROFILE: tmpDir };
  execSync('node packages/cli/dist/index.js snapshot', {
    cwd: ROOT, stdio: 'pipe', timeout: 10000, env,
  });
  const statsPath = join(tmpDir, '.ielts', 'stats.json');
  const stats = JSON.parse(readFileSync(statsPath, 'utf-8'));
  // 验证快照确实更新了 fixtures 写入的 stats
  if (stats.lastSnapshot === '2026-06-03T12:00:00.000Z') {
    throw new Error('snapshot did not update stats.json (lastSnapshot unchanged)');
  }
  // 验证 fixture-backed 的各个 section
  if (!stats.writing?.totalEssays || stats.writing.totalEssays < 1)
    throw new Error(`stats.writing.totalEssays = ${stats.writing?.totalEssays}`);
  if (!stats.reading?.totalPassages || stats.reading.totalPassages < 1)
    throw new Error(`stats.reading.totalPassages = ${stats.reading?.totalPassages}`);
  if (!stats.listening?.totalSessions || stats.listening.totalSessions < 1)
    throw new Error(`stats.listening.totalSessions = ${stats.listening?.totalSessions}`);
  if (!stats.combined?.overallBand)
    throw new Error(`stats.combined.overallBand = ${stats.combined?.overallBand}`);
  // 将生成的快照复制到 dashboard public,使 builds 使用真实数据
  const dashPublic = join(ROOT, 'packages', 'dashboard', 'public');
  cpSync(statsPath, join(dashPublic, 'stats.json'), { force: true });
});

/* Step 5: Build dashboard */
step('pnpm --filter @ielts/dashboard build', () => {
  execSync('pnpm --filter @ielts/dashboard build', {
    cwd: ROOT, stdio: 'pipe', timeout: 60000,
  });
});

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n  ${exitCode === 0 ? '\u2705 All checks passed' : '\u274c Some checks failed'} (${elapsed}s)`);
process.exit(exitCode);
