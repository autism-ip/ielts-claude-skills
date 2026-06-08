import { readdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = join(homedir(), '.ielts');
const MODULES = {
    writing: 'writing', reading: 'reading', listening: 'listening',
    speaking: 'speaking', vocab: 'vocab',
};
export function lsCommand(module) {
    if (module) {
        const dir = MODULES[module];
        if (!dir) {
            console.log(`Unknown: ${module}`);
            return;
        }
        const p = join(BASE, dir);
        if (!existsSync(p)) {
            console.log(`No ${module} records.`);
            return;
        }
        const files = readdirSync(p).filter(f => f.endsWith('.md') || f.endsWith('.json'));
        console.log(`${module} (${files.length}):`);
        files.forEach(f => console.log(`  ${f}`));
        return;
    }
    console.log('IELTS Data:');
    console.log('─'.repeat(30));
    for (const [name, dir] of Object.entries(MODULES)) {
        const p = join(BASE, dir);
        const n = existsSync(p) ? readdirSync(p).filter(f => f.endsWith('.md') || f.endsWith('.json')).length : 0;
        console.log(`${name.padEnd(12)} ${n} files`);
    }
}
//# sourceMappingURL=ls.js.map