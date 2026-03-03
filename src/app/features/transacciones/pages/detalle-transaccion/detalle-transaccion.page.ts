import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TransaccionService } from '../../../../core/services/transaccion.service';
import type { Transaccion } from '../../../../core/models/transaccion.model';

@Component({
  selector: 'app-detalle-transaccion',
  templateUrl: './detalle-transaccion.page.html',
  styleUrls: ['./detalle-transaccion.page.scss'],
  standalone: false,
})
export class DetalleTransaccionPage implements OnInit {
  id = this.route.snapshot.paramMap.get('id') ?? '';
  item: Transaccion | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tx: TransaccionService,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.tx.hydrate();
    this.item = this.tx.getById(this.id);
    if (!this.item) {
      this.msg.add({ severity: 'warn', summary: 'No encontrada', detail: 'Transacción no existe.' });
      await this.router.navigateByUrl('/tabs/transacciones', { replaceUrl: true });
    }
  }

  back(): void {
    this.router.navigateByUrl('/tabs/transacciones');
  }

  confirmDelete(): void {
    if (!this.item) return;

    this.confirm.confirm({
      header: 'Eliminar transacción',
      message: '¿Seguro que deseas eliminar esta transacción?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        await this.tx.delete(this.item!.id);
        this.msg.add({ severity: 'info', summary: 'Eliminada', detail: 'Transacción eliminada.' });
        await this.router.navigateByUrl('/tabs/transacciones', { replaceUrl: true });
      },
    });
  }
}
