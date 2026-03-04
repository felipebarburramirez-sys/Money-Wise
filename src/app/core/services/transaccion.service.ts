import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from './storage.keys';
import type { Transaccion, ComprobanteFoto } from '../models/transaccion.model';
import type { CategoriaKey } from '../constants/categorias.const';
import type { TipoTransaccion } from '../constants/tipos-transaccion.const';
import { FileSystemService } from './file-system.service';

export type CreateTransaccionInput = {
  tipo: TipoTransaccion;
  categoria: CategoriaKey;
  monto: number;
  fecha: Date | string;
  nota?: string;
};

export type UpdateTransaccionInput = Partial<Omit<CreateTransaccionInput, 'fecha'>> & {
  fecha?: Date | string;
};

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  private readonly list$ = new BehaviorSubject<Transaccion[]>([]);
  readonly transacciones$ = this.list$.asObservable();

  constructor(private storage: StorageService, private fs: FileSystemService) {}

  async hydrate(): Promise<void> {
    const saved = (await this.storage.get<Transaccion[]>(STORAGE_KEYS.TRANSACCIONES)) ?? [];
    this.list$.next(this.sortDesc(saved));
  }

  list(): Transaccion[] {
    return this.list$.getValue();
  }

  getById(id: string): Transaccion | null {
    return this.list().find((t) => t.id === id) ?? null;
  }

  async create(input: CreateTransaccionInput): Promise<Transaccion> {
    const now = new Date().toISOString();
    const tx: Transaccion = {
      id: this.makeId(),
      tipo: input.tipo,
      categoria: input.categoria,
      monto: this.normalizeMoney(input.monto),
      fecha: this.toISO(input.fecha),
      nota: input.nota?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      comprobantes: [],
    };

    const next = this.sortDesc([tx, ...this.list()]);
    await this.persist(next);
    return tx;
  }

  async update(id: string, input: UpdateTransaccionInput): Promise<Transaccion> {
    const current = this.getById(id);
    if (!current) throw new Error('Transacción no encontrada.');

    const updated: Transaccion = {
      ...current,
      tipo: input.tipo ?? current.tipo,
      categoria: input.categoria ?? current.categoria,
      monto: input.monto != null ? this.normalizeMoney(input.monto) : current.monto,
      fecha: input.fecha != null ? this.toISO(input.fecha) : current.fecha,
      nota: input.nota != null ? (input.nota.trim() || undefined) : current.nota,
      updatedAt: new Date().toISOString(),
    };

    const next = this.sortDesc(this.list().map((t) => (t.id === id ? updated : t)));
    await this.persist(next);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const current = this.getById(id);
    if (current?.comprobantes?.length) {
      // borrar archivos asociados
      for (const c of current.comprobantes) {
        await this.fs.deleteFile(c.path);
      }
    }
    const next = this.list().filter((t) => t.id !== id);
    await this.persist(next);
  }

  async addComprobante(txId: string, saved: { path: string; webViewPath: string }): Promise<Transaccion> {
    const current = this.getById(txId);
    if (!current) throw new Error('Transacción no encontrada.');

    const now = new Date().toISOString();
    const comprobante: ComprobanteFoto = {
      id: this.makeId(),
      path: saved.path,
      webViewPath: saved.webViewPath,
      createdAt: now,
    };

    const updated: Transaccion = {
      ...current,
      comprobantes: [comprobante, ...(current.comprobantes ?? [])],
      updatedAt: now,
    };

    const next = this.sortDesc(this.list().map((t) => (t.id === txId ? updated : t)));
    await this.persist(next);
    return updated;
  }

  async removeComprobante(txId: string, comprobanteId: string): Promise<Transaccion> {
    const current = this.getById(txId);
    if (!current) throw new Error('Transacción no encontrada.');

    const target = (current.comprobantes ?? []).find((c) => c.id === comprobanteId);
    if (target) await this.fs.deleteFile(target.path);

    const now = new Date().toISOString();
    const updated: Transaccion = {
      ...current,
      comprobantes: (current.comprobantes ?? []).filter((c) => c.id !== comprobanteId),
      updatedAt: now,
    };

    const next = this.sortDesc(this.list().map((t) => (t.id === txId ? updated : t)));
    await this.persist(next);
    return updated;
  }

  private async persist(list: Transaccion[]): Promise<void> {
    this.list$.next(this.sortDesc(list));
    await this.storage.set(STORAGE_KEYS.TRANSACCIONES, this.list());
  }

  private sortDesc(list: Transaccion[]): Transaccion[] {
    return [...list].sort((a, b) => {
      const da = new Date(a.fecha).getTime();
      const db = new Date(b.fecha).getTime();
      return db - da;
    });
  }

  private normalizeMoney(n: number): number {
    if (!Number.isFinite(n)) throw new Error('Monto inválido.');
    const v = Math.abs(n);
    return Math.round(v * 100) / 100;
  }

  private toISO(d: Date | string): string {
    if (d instanceof Date) return d.toISOString();
    const parsed = new Date(d);
    if (Number.isNaN(parsed.getTime())) throw new Error('Fecha inválida.');
    return parsed.toISOString();
  }

  private makeId(): string {
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return c.randomUUID();
    return `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}
