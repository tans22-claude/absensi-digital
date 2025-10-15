/**
 * Offline Sync Manager
 * Handles offline attendance recording and synchronization
 */

import { openDB, IDBPDatabase } from 'idb';

interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  scheduleId?: string;
  date: string;
  status: string;
  note?: string;
  method: string;
  timestamp: number;
  synced: boolean;
}

class OfflineSyncManager {
  private db: IDBPDatabase | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB('attendance-offline', 1, {
      upgrade(db) {
        const store = db.createObjectStore('attendance', { keyPath: 'id' });
        store.createIndex('by-synced', 'synced');
      },
    });
  }

  async saveOfflineAttendance(data: {
    studentId: string;
    classId: string;
    scheduleId?: string;
    date: string;
    status: string;
    note?: string;
    method: string;
  }) {
    await this.init();

    const record = {
      id: `offline-${Date.now()}-${Math.random()}`,
      ...data,
      timestamp: Date.now(),
      synced: false,
    };

    await this.db!.add('attendance', record);
    return record;
  }

  async getPendingRecords() {
    await this.init();
    const tx = this.db!.transaction('attendance', 'readonly');
    const index = tx.store.index('by-synced');
    return await index.getAll(IDBKeyRange.only(false));
  }

  async markAsSynced(id: string) {
    await this.init();
    const tx = this.db!.transaction('attendance', 'readwrite');
    const record = await tx.store.get(id);
    if (record) {
      record.synced = true;
      await tx.store.put(record);
    }
  }

  async syncPendingRecords() {
    const pending = await this.getPendingRecords();

    if (pending.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    const errors: string[] = [];

    for (const record of pending) {
      try {
        const response = await fetch('/api/attendance/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: record.studentId,
            classId: record.classId,
            scheduleId: record.scheduleId,
            date: record.date,
            status: record.status,
            note: record.note,
            method: record.method,
          }),
        });

        if (response.ok) {
          await this.markAsSynced(record.id);
          syncedCount++;
        } else {
          const error = await response.json();
          errors.push(`${record.id}: ${error.error}`);
        }
      } catch (error) {
        errors.push(`${record.id}: Network error`);
      }
    }

    return {
      success: errors.length === 0,
      synced: syncedCount,
      total: pending.length,
      errors,
    };
  }

  async clearSyncedRecords() {
    await this.init();
    const tx = this.db!.transaction('attendance', 'readwrite');
    const index = tx.store.index('by-synced');
    const synced = await index.getAll(IDBKeyRange.only(true));

    for (const record of synced) {
      await tx.store.delete(record.id);
    }
  }
}

export const offlineSyncManager = new OfflineSyncManager();

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Back online, syncing pending records...');
    const result = await offlineSyncManager.syncPendingRecords();
    console.log('Sync result:', result);

    if (result.success) {
      await offlineSyncManager.clearSyncedRecords();
    }
  });
}
