import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-photo-selector',
  templateUrl: './photo-selector.component.html',
  styleUrls: ['./photo-selector.component.scss'],
  standalone: false
})
export class PhotoSelectorComponent {
  @Input() disabled = false;

  @Output() camera = new EventEmitter<void>();
  @Output() gallery = new EventEmitter<void>();

  onCamera(): void {
    this.camera.emit();
  }

  onGallery(): void {
    this.gallery.emit();
  }
}
