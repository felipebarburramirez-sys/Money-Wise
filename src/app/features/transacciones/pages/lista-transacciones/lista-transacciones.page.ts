import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TransaccionService } from '../../../../core/services/transaccion.service';
import type { Transaccion } from '../../../../core/models/transaccion.model';

import { CATEGORIAS } from '../../../../core/constants/categorias.const';
import { TIPOS_TRANSACCION } from '../../../../core/constants/tipos-transaccion.const';
import type { CategoriaKey } from '../../../../core/constants/categorias.const';
import type { TipoTransaccion } from '../../../../core/constants/tipos-transaccion.const';

type OptionItem<T> = { label: string; value: T };

@Component({
  selector: 'app-lista-transacciones',
  templateUrl: './lista-transacciones.page.html',
  styleUrls: ['./lista-transacciones.page.scss'],
  standalone: false,
})
export class ListaTransaccionesPage implements OnInit {
  // Exponer constants al template (DRY)
  CATEGORIAS = CATEGORIAS;
  TIPOS_TRANSACCION = TIPOS_TRANSACCION;

  // data
  all: Transaccion[] = [];
  view: Transaccion[] = [];

  // filters
  q = '';
  tipo: TipoTransaccion | 'ALL' = 'ALL';
  categoria: CategoriaKey | 'ALL' = 'ALL';

  tipos: OptionItem<TipoTransaccion | 'ALL'>[] = [
    { label: 'Todos', value: 'ALL' },
    ...TIPOS_TRANSACCION.map((t) => ({ label: t.label, value: t.value })),
  ];

  categorias: OptionItem<CategoriaKey | 'ALL'>[] = [
    { label: 'Todas', value: 'ALL' },
    ...CATEGORIAS.map((c) => ({ label: c.label, value: c.key })),
  ];

  // dialog create/edit
  showDialog = false;
  editId: string | null = null;

  formTipo: TipoTransaccion = 'GASTO';
  formCategoria: CategoriaKey = 'ALIMENTACION';
  formMonto: number | null = null;
  formFecha: Date = new Date();
  formNota = '';

  constructor(
    private tx: TransaccionService,
    private router: Router,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  async ngOnInit(): Promise<void> {
    // AppComponent ya hidrata, pero esto hace la página robusta si entras directo
    await this.tx.hydrate();
    this.refresh();
  }

  refresh(): void {
    this.all = this.tx.list();
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.q.trim().toLowerCase();

    this.view = this.all.filter((t) => {
      if (this.tipo !== 'ALL' && t.tipo !== this.tipo) return false;
      if (this.categoria !== 'ALL' && t.categoria !== this.categoria) return false;

      if (!q) return true;

      const note = (t.nota ?? '').toLowerCase();
      const tipo = (t.tipo ?? '').toLowerCase();
      const cat = (t.categoria ?? '').toLowerCase();

      return (
        note.includes(q) ||
        tipo.includes(q) ||
        cat.includes(q) ||
        String(t.monto).includes(q)
      );
    });
  }

  openCreate(): void {
    this.editId = null;
    this.formTipo = 'GASTO';
    this.formCategoria = 'ALIMENTACION';
    this.formMonto = null;
    this.formFecha = new Date();
    this.formNota = '';
    this.showDialog = true;
  }

  openEdit(item: Transaccion): void {
    this.editId = item.id;
    this.formTipo = item.tipo;
    this.formCategoria = item.categoria;
    this.formMonto = item.monto;
    this.formFecha = new Date(item.fecha);
    this.formNota = item.nota ?? '';
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  async save(): Promise<void> {
    if (!this.formMonto || this.formMonto <= 0) {
      this.msg.add({
        severity: 'warn',
        summary: 'Monto',
        detail: 'Ingresa un monto válido.',
      });
      return;
    }

    try {
      if (!this.editId) {
        await this.tx.create({
          tipo: this.formTipo,
          categoria: this.formCategoria,
          monto: this.formMonto,
          fecha: this.formFecha,
          nota: this.formNota,
        });

        this.msg.add({
          severity: 'success',
          summary: 'Creada',
          detail: 'Transacción creada ✅',
        });
      } else {
        await this.tx.update(this.editId, {
          tipo: this.formTipo,
          categoria: this.formCategoria,
          monto: this.formMonto,
          fecha: this.formFecha,
          nota: this.formNota,
        });

        this.msg.add({
          severity: 'success',
          summary: 'Actualizada',
          detail: 'Transacción actualizada ✅',
        });
      }

      this.closeDialog();
      this.refresh();
    } catch (e: any) {
      this.msg.add({
        severity: 'error',
        summary: 'Error',
        detail: e?.message ?? 'Error guardando transacción',
      });
    }
  }

  confirmDelete(item: Transaccion): void {
    this.confirm.confirm({
      header: 'Eliminar transacción',
      message: '¿Seguro que deseas eliminar esta transacción?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        await this.tx.delete(item.id);
        this.msg.add({
          severity: 'info',
          summary: 'Eliminada',
          detail: 'Transacción eliminada.',
        });
        this.refresh();
      },
    });
  }

  goDetalle(item: Transaccion): void {
    this.router.navigate(['/tabs/transacciones', item.id]);
  }

  trackById(_: number, t: Transaccion): string {
    return t.id;
  }
}
