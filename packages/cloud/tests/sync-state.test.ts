import { describe, it, expect } from 'vitest';
import { SyncState } from '../src/sync-state.js';

describe('SyncState', () => {
  const state = new SyncState();

  it('computes creates for unknown records', () => {
    const diff = state.computeDiff([{ localId: 'e1', hash: 'a' }, { localId: 'e2', hash: 'b' }]);
    expect(diff.toCreate).toHaveLength(2);
  });

  it('marks unchanged after set with same hash', () => {
    state.set('e1', 'a', 'r1');
    const diff = state.computeDiff([{ localId: 'e1', hash: 'a' }]);
    expect(diff.unchanged).toHaveLength(1);
  });

  it('getLastSyncTime returns a value after set', () => {
    expect(state.getLastSyncTime()).toBeTruthy();
  });

  it('getStats returns counts', () => {
    const s = state.getStats();
    expect(s.total).toBeGreaterThan(0);
  });
});
