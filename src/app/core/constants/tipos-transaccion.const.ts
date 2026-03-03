export type TipoTransaccion = 'INGRESO' | 'GASTO';

export const TIPOS_TRANSACCION: { value: TipoTransaccion; label: string }[] = [
  { value: 'INGRESO', label: 'Ingreso' },
  { value: 'GASTO', label: 'Gasto' },
];
