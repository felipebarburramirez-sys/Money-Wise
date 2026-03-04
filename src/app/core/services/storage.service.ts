import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import type { StorageKey } from './storage.keys';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;
  private _ready: Promise<void> | null = null;

  constructor(private storage: Storage) {}

  /**
   * Inicializa Ionic Storage una vez.
   * Se llamará desde CoreModule via APP_INITIALIZER,
   * pero también es seguro si alguien lo llama manualmente.
   */
  init(): Promise<void> {
    if (this._ready) return this._ready;

    this._ready = (async () => {
      this._storage = await this.storage.create();
    })();

    return this._ready;
  }

  private async ensureReady(): Promise<Storage> {
    if (!this._ready) {
      await this.init();
    } else {
      await this._ready;
    }

    if (!this._storage) {
      // Ultra defensivo
      this._storage = await this.storage.create();
    }

    return this._storage;
  }

  async set<T>(key: StorageKey, value: T): Promise<void> {
    const s = await this.ensureReady();
    await s.set(key, value);
  }

  async get<T>(key: StorageKey): Promise<T | null> {
    const s = await this.ensureReady();
    const value = await s.get(key);
    return (value ?? null) as T | null;
  }

  async remove(key: StorageKey): Promise<void> {
    const s = await this.ensureReady();
    await s.remove(key);
  }

  /**
   * Mantiene tu comportamiento actual:
   * Limpia SOLO lo del dominio Money-Wise (prefijo mw_)
   */
  async clearAll(): Promise<void> {
    const s = await this.ensureReady();
    const keys = await s.keys(); // Ionic Storage expone keys()

    const keysToRemove = keys.filter((k) => typeof k === 'string' && k.startsWith('mw_'));
    for (const k of keysToRemove) {
      await s.remove(k);
    }
  }
}
