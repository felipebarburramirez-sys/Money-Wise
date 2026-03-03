import type { CategoriaKey } from '../constants/categorias.const';
import type { TipoTransaccion } from '../constants/tipos-transaccion.const';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  categoria: CategoriaKey;
  monto: number;
  fecha: string;
  nota?: string;
  createdAt: string;
  updatedAt: string;
}
