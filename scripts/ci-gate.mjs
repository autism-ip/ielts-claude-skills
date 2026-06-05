#!/usr/bin/env node
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(root, '..', 'skills');
const docsDir = join(root, '..', 'docs');

let exitCode = 0;
const required = ['ielts', 'ielts-writing', 'ielts-reading', 'ielts-speaking'];
for (const s of required) {
  if (!existsSync(join(skillsDir, s, 'SKILL.md'))) {
    console.log(`FAIL: Missing ${s}/SKILL.md`);
    exitCode = 1;
  }
}
if (existsSync(docsDir)) {
  const n = readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
  console.log(n > 0 ? `OK: ${n} docs` : 'WARN: empty docs');
}
console.log(exitCode === 0 ? 'OK: CI gate passed' : 'FAIL: CI gate failed');
process.exit(exitCode);
