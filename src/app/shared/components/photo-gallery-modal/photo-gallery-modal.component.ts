import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ComprobanteFoto } from '../../../core/models/transaccion.model';

@Component({
  selector: 'app-photo-gallery-modal',
  templateUrl: './photo-gallery-modal.component.html',
  styleUrls: ['./photo-gallery-modal.component.scss'],
  standalone: false
})
export class PhotoGalleryModalComponent {
  @Input() visible = false;
  @Input() title = 'Comprobantes';
  @Input() fotos: ComprobanteFoto[] = [];
  @Input() deletable = true;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter<string>();

  activeIndex = 0;

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onRemoveActive(): void {
    const current = this.fotos?.[this.activeIndex];
    if (!current) return;
    this.remove.emit(current.id);
  }

  trackById(_: number, item: ComprobanteFoto): string {
    return item.id;
  }
}
