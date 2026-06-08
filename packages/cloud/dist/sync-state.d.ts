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
<<<<<<< HEAD
    private statePath;
    constructor(statePath?: string);
    private load;
    private saveDirPath;
=======
    constructor();
    private load;
>>>>>>> origin/feat/gh-57-cloud-cli
    private save;
    set(localId: string, hash: string, remoteId?: string): void;
    setBatch(items: {
        localId: string;
        hash: string;
        remoteId?: string;
    }[]): void;
<<<<<<< HEAD
    get(localId: string): SyncEntry | undefined;
=======
>>>>>>> origin/feat/gh-57-cloud-cli
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