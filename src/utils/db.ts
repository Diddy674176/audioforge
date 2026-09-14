import { openDB, type IDBPDatabase } from 'idb';
import type { ProjectData, AudioSettings } from '../audio/types';

const DB_NAME = 'audioforge-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          const store = db.createObjectStore('projects', { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('presets')) {
          db.createObjectStore('presets', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveProject(project: ProjectData): Promise<void> {
  const db = await getDb();
  await db.put('projects', project);
}

export async function listProjects(): Promise<ProjectData[]> {
  const db = await getDb();
  const all = await db.getAll('projects');
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getProject(id: string): Promise<ProjectData | undefined> {
  const db = await getDb();
  return db.get('projects', id);
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('projects', id);
}

export interface CustomPreset {
  id: string;
  name: string;
  settings: AudioSettings;
  createdAt: number;
}

export async function saveCustomPreset(p: CustomPreset): Promise<void> {
  const db = await getDb();
  await db.put('presets', p);
}

export async function listCustomPresets(): Promise<CustomPreset[]> {
  const db = await getDb();
  return db.getAll('presets');
}

export async function deleteCustomPreset(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('presets', id);
}
