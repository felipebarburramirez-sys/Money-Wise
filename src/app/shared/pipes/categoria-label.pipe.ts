import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORIA_LABEL } from '../../core/constants/categorias.const';
import type { CategoriaKey } from '../../core/constants/categorias.const';

@Pipe({ name: 'categoriaLabel', standalone: false })
export class CategoriaLabelPipe implements PipeTransform {
  transform(value: CategoriaKey | string | null | undefined): string {
    if (!value) return '';
    return (CATEGORIA_LABEL as Record<string, string>)[value] ?? String(value);
  }
}
