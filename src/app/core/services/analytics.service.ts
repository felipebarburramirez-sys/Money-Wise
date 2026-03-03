import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs';
import { TransaccionService } from './transaccion.service';
import type { ResumenFinanciero, ResumenPorCategoriaItem } from '../models/resumen-financiero.model';
import { CATEGORIA_LABEL } from '../constants/categorias.const';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private tx: TransaccionService) {}

  /**
   * Resumen reactivo.
   * Por defecto calcula con "hoy" como referencia del mes.
   */
  resumenFinanciero$() {
    return this.tx.transacciones$.pipe(
      startWith(this.tx.list()),
      map((list) => this.calculate(list, new Date()))
    );
  }

  calculate(list: any[], ref: Date): ResumenFinanciero {
    const now = ref;
    const month = now.getMonth();
    const year = now.getFullYear();

    let ingresosMes = 0;
    let gastosMes = 0;
    let saldoActual = 0;

    const gastosPorCategoriaMap = new Map<string, number>();

    for (const t of list) {
      const monto = Number(t.monto) || 0;

      // saldo global
      if (t.tipo === 'INGRESO') saldoActual += monto;
      if (t.tipo === 'GASTO') saldoActual -= monto;

      // filtro mes
      const d = new Date(t.fecha);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;

      if (t.tipo === 'INGRESO') ingresosMes += monto;
      if (t.tipo === 'GASTO') {
        gastosMes += monto;
        const prev = gastosPorCategoriaMap.get(t.categoria) ?? 0;
        gastosPorCategoriaMap.set(t.categoria, prev + monto);
      }
    }

    const totalGastos = gastosMes || 0;

    const gastosPorCategoria: ResumenPorCategoriaItem[] = Array.from(gastosPorCategoriaMap.entries())
      .map(([categoria, total]) => {
        const porcentaje = totalGastos > 0 ? (total / totalGastos) * 100 : 0;
        return {
          categoria: categoria as any,
          label: (CATEGORIA_LABEL as any)[categoria] ?? String(categoria),
          totalGastos: round2(total),
          porcentaje: round2(porcentaje),
        };
      })
      .sort((a, b) => b.totalGastos - a.totalGastos);

    return {
      saldoActual: round2(saldoActual),
      ingresosMes: round2(ingresosMes),
      gastosMes: round2(gastosMes),
      gastosPorCategoria,
    };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
