#!/usr/bin/env node

/**
 * [INPUT]: 依赖 child_process 执行 CLI 命令
 * [OUTPUT]: 对外提供 smoke test 入口，验证构建→测试→夹具→快照→Dashboard 全链路
 * [POS]: scripts/ 的冒烟测试脚本，发布前运行
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

let exitCode = 0;
const start = Date.now();

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
  execSync('pnpm build', { stdio: 'pipe', timeout: 120000 });
});

/* Step 2: Run tests */
step('pnpm test', () => {
  execSync('pnpm test', { stdio: 'pipe', timeout: 60000 });
});

/* Step 3: Install fixtures in temp dir */
step('ielts init --fixtures', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'ielts-smoke-'));
  execSync('node packages/cli/dist/index.js init --fixtures', {
    stdio: 'pipe', timeout: 10000, env: { ...process.env, HOME: tmp },
  });
  process.env._IELTS_SMOKE_HOME = tmp;
  const base = join(tmp, '.ielts');
  if (!existsSync(join(base, 'profile.json'))) throw new Error('profile.json missing');
  if (!existsSync(join(base, 'stats.json'))) throw new Error('stats.json missing');
  if (!existsSync(join(base, 'writing'))) throw new Error('writing/ missing');
});

/* Step 4: Generate snapshot */
step('ielts snapshot', () => {
  const home = process.env._IELTS_SMOKE_HOME;
  execSync('node packages/cli/dist/index.js snapshot', {
    stdio: 'pipe', timeout: 10000, env: { ...process.env, HOME: home },
  });
  const stats = JSON.parse(readFileSync(join(home, '.ielts', 'stats.json'), 'utf-8'));
  if (!stats.writing?.totalEssays || stats.writing.totalEssays < 1) {
    throw new Error(`stats.writing.totalEssays = ${stats.writing?.totalEssays}`);
  }
});

/* Step 5: Build dashboard */
step('pnpm --filter @ielts/dashboard build', () => {
  execSync('pnpm --filter @ielts/dashboard build', {
    stdio: 'pipe', timeout: 60000,
  });
});

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n  ${exitCode === 0 ? '\u2705 All checks passed' : '\u274c Some checks failed'} (${elapsed}s)`);
process.exit(exitCode);
