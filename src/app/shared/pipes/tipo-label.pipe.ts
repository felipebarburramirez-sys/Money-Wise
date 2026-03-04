import { Pipe, PipeTransform } from '@angular/core';
import type { TipoTransaccion } from '../../core/constants/tipos-transaccion.const';

const MAP: Record<string, string> = {
  INGRESO: 'Ingreso',
  GASTO: 'Gasto',
};

@Pipe({ name: 'tipoLabel', standalone: false })
export class TipoLabelPipe implements PipeTransform {
  transform(value: TipoTransaccion | string | null | undefined): string {
    if (!value) return '';
    return MAP[String(value)] ?? String(value);
  }
}
