export type CategoriaKey =
  | 'ALIMENTACION'
  | 'TRANSPORTE'
  | 'VIVIENDA'
  | 'SALUD'
  | 'EDUCACION'
  | 'ENTRETENIMIENTO'
  | 'SERVICIOS'
  | 'OTROS';

export const CATEGORIAS: { key: CategoriaKey; label: string }[] = [
  { key: 'ALIMENTACION', label: 'Alimentación' },
  { key: 'TRANSPORTE', label: 'Transporte' },
  { key: 'VIVIENDA', label: 'Vivienda' },
  { key: 'SALUD', label: 'Salud' },
  { key: 'EDUCACION', label: 'Educación' },
  { key: 'ENTRETENIMIENTO', label: 'Entretenimiento' },
  { key: 'SERVICIOS', label: 'Servicios' },
  { key: 'OTROS', label: 'Otros' },
];

export const CATEGORIA_LABEL: Record<CategoriaKey, string> = CATEGORIAS.reduce(
  (acc, c) => {
    acc[c.key] = c.label;
    return acc;
  },
  {} as Record<CategoriaKey, string>
);
