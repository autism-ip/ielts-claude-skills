import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'; import { homedir } from 'node:os'; import { join, dirname } from 'node:path';
export interface SyncEntry{localId:string;remoteId?:string;hash:string;lastSyncedAt?:string;}
export interface SyncDiff{toCreate:{localId:string;hash:string}[];toUpdate:{localId:string;remoteId:string;hash:string}[];unchanged:{localId:string}[];}
const STATE=join(homedir(),'.ielts','sync','feishu.json');
export class SyncState{private entries:Map<string,SyncEntry>=new Map();constructor(private statePath?:string){this.load();}
private load():void{const p=this.statePath||STATE;try{const d=JSON.parse(readFileSync(p,'utf-8'));for(const e of d)this.entries.set(e.localId,e);}catch(e:any){if(e.code!=='ENOENT')console.warn('SyncState: ignoring corrupted state file');}}
private save(): void { const p = this.statePath || STATE; mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify([...this.entries.values()], null, 2)); }
set(localId:string,hash:string,remoteId?:string):void{const ex=this.entries.get(localId);this.entries.set(localId,{localId,remoteId:remoteId||ex?.remoteId,hash,lastSyncedAt:new Date().toISOString()});this.save();}
setBatch(items:{localId:string;hash:string;remoteId?:string}[]):void{for(const i of items)this.set(i.localId,i.hash,i.remoteId);}
computeDiff(locals:{localId:string;hash:string}[]):SyncDiff{const d:SyncDiff={toCreate:[],toUpdate:[],unchanged:[]};for(const l of locals){const s=this.entries.get(l.localId);if(!s||!s.remoteId)d.toCreate.push({localId:l.localId,hash:l.hash});else if(s.hash!==l.hash)d.toUpdate.push({localId:l.localId,remoteId:s.remoteId,hash:l.hash});else d.unchanged.push({localId:l.localId});}return d;}
getLastSyncTime():string|null{const t=[...this.entries.values()].map(e=>e.lastSyncedAt).filter(Boolean)as string[];return t.length?t.sort().reverse()[0]:null;}
getStats(){return{total:this.entries.size,synced:[...this.entries.values()].filter(e=>e.remoteId).length};}}