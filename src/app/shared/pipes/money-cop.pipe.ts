import { Pipe, PipeTransform } from '@angular/core';
import type { TipoTransaccion } from '../../core/constants/tipos-transaccion.const';

@Pipe({ name: 'moneyCop', standalone: false })
export class MoneyCopPipe implements PipeTransform {
  private fmt = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  transform(value: number | null | undefined, tipo?: TipoTransaccion): string {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return this.fmt.format(0);

    const signed = tipo === 'GASTO' ? -Math.abs(n) : Math.abs(n);
    return this.fmt.format(tipo ? signed : n);
  }
}
