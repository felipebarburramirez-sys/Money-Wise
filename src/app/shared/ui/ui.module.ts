import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DialogModule,
    ToastModule,
    CardModule,
    DividerModule,
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DialogModule,
    ToastModule,
    CardModule,
    DividerModule,
  ],
  providers: [MessageService],
})
export class UiModule {}
