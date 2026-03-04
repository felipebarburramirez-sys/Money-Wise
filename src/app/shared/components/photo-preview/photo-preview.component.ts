import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ComprobanteFoto } from '../../../core/models/transaccion.model';

@Component({
  selector: 'app-photo-preview',
  templateUrl: './photo-preview.component.html',
  styleUrls: ['./photo-preview.component.scss'],
  standalone: false
})
export class PhotoPreviewComponent {
  @Input({ required: true }) foto!: ComprobanteFoto;
  @Input() deletable = true;

  @Output() remove = new EventEmitter<string>(); // comprobanteId

  onRemove(): void {
    this.remove.emit(this.foto.id);
  }
}
