import type { CategoriaKey } from '../constants/categorias.const';

export interface ResumenPorCategoriaItem {
  categoria: CategoriaKey;
  label: string;
  totalGastos: number;
  porcentaje: number;
}

export interface ResumenFinanciero {
  saldoActual: number;
  ingresosMes: number;
  gastosMes: number;
  gastosPorCategoria: ResumenPorCategoriaItem[];
}
