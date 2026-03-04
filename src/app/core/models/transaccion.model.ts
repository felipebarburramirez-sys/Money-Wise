import type { CategoriaKey } from '../constants/categorias.const';
import type { TipoTransaccion } from '../constants/tipos-transaccion.const';

export interface ComprobanteFoto {
  id: string;            // id interno
  path: string;          // ruta en Filesystem (Directory.Data)
  webViewPath: string;   // URI usable en <img> (convertFileSrc o dataURL web)
  createdAt: string;     // ISO
}

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  categoria: CategoriaKey;
  monto: number;
  fecha: string;
  nota?: string;
  createdAt: string;
  updatedAt: string;

  comprobantes?: ComprobanteFoto[];
}
