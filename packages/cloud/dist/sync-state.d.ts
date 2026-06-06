export interface SyncEntry {
    localId: string;
    remoteId?: string;
    hash: string;
    lastSyncedAt?: string;
}
export interface SyncDiff {
    toCreate: {
        localId: string;
        hash: string;
    }[];
    toUpdate: {
        localId: string;
        remoteId: string;
        hash: string;
    }[];
    unchanged: {
        localId: string;
    }[];
}
export declare class SyncState {
    private entries;
    private statePath;
    constructor(statePath?: string);
    private load;
    private saveDirPath;
    private save;
    set(localId: string, hash: string, remoteId?: string): void;
    setBatch(items: {
        localId: string;
        hash: string;
        remoteId?: string;
    }[]): void;
    get(localId: string): SyncEntry | undefined;
    computeDiff(locals: {
        localId: string;
        hash: string;
    }[]): SyncDiff;
    getLastSyncTime(): string | null;
    getStats(): {
        total: number;
        synced: number;
    };
}
//# sourceMappingURL=sync-state.d.ts.map