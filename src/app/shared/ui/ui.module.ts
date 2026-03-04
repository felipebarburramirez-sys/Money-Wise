import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { GalleriaModule } from 'primeng/galleria';

import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ProgressBarModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DialogModule,
    ToastModule,
    CardModule,
    DividerModule,
    ConfirmDialogModule,
    InputNumberModule,
    TextareaModule,
    GalleriaModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ProgressBarModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DialogModule,
    ToastModule,
    CardModule,
    DividerModule,
    ConfirmDialogModule,
    InputNumberModule,
    TextareaModule,
    GalleriaModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class UiModule {}
