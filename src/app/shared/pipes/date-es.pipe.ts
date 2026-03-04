import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateEs', standalone: false })
export class DateEsPipe implements PipeTransform {
  private fmt = new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return this.fmt.format(d);
  }
}
