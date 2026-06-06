export interface SyncResult { module: string; created: number; updated: number; skipped: number; errors: string[]; }
export interface ConnectionResult { success: boolean; message: string; }
export interface CloudProvider { readonly name: string; test(): Promise<ConnectionResult>; sync(module?: string): Promise<SyncResult>; status(): Promise<Record<string, any>>; }
