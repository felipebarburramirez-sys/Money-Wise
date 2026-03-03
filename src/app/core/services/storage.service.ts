import { Injectable } from '@angular/core';
import type { StorageKey } from './storage.keys';

@Injectable({ providedIn: 'root' })
export class StorageService {
  async set<T>(key: StorageKey, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async get<T>(key: StorageKey): Promise<T | null> {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      // dato corrupto -> limpiar
      localStorage.removeItem(key);
      return null;
    }
  }

  async remove(key: StorageKey): Promise<void> {
    localStorage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    // Limpia SOLO lo del dominio Money-Wise (prefijo mw_)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('mw_')) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}
