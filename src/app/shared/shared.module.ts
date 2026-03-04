import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { UiModule } from './ui/ui.module';

import { PhotoSelectorComponent } from './components/photo-selector/photo-selector.component';
import { PhotoPreviewComponent } from './components/photo-preview/photo-preview.component';
import { PhotoGalleryModalComponent } from './components/photo-gallery-modal/photo-gallery-modal.component';

import { MoneyCopPipe } from './pipes/money-cop.pipe';
import { DateEsPipe } from './pipes/date-es.pipe';
import { CategoriaLabelPipe } from './pipes/categoria-label.pipe';
import { TipoLabelPipe } from './pipes/tipo-label.pipe';

@NgModule({
  declarations: [
    PhotoSelectorComponent,
    PhotoPreviewComponent,
    PhotoGalleryModalComponent,

    MoneyCopPipe,
    DateEsPipe,
    CategoriaLabelPipe,
    TipoLabelPipe,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, UiModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UiModule,

    PhotoSelectorComponent,
    PhotoPreviewComponent,
    PhotoGalleryModalComponent,

    MoneyCopPipe,
    DateEsPipe,
    CategoriaLabelPipe,
    TipoLabelPipe,
  ],
})
export class SharedModule {}
