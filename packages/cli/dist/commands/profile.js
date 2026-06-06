import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PROFILE_PATH = join(homedir(), '.ielts', 'profile.json');
export function profileCommand() {
    if (!existsSync(PROFILE_PATH)) {
        console.log('No profile found. Run `ielts init` first.');
        return;
    }
    const p = JSON.parse(readFileSync(PROFILE_PATH, 'utf-8'));
    const t = p.target;
    console.log('IELTS Profile');
    console.log('─'.repeat(30));
    console.log(`Target:  O ${t.overall} | W ${t.writing} | R ${t.reading} | L ${t.listening} | S ${t.speaking}`);
    console.log(`Exam:    ${p.examDate || '—'}`);
    console.log(`Zone:    ${p.timezone}`);
    console.log(`Daily:   ${p.preferences.dailyGoal} min`);
    if (p.preferences.focusAreas?.length) {
        console.log(`Focus:   ${p.preferences.focusAreas.join(', ')}`);
    }
}
//# sourceMappingURL=profile.js.map