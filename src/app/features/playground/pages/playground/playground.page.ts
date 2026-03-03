import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

type OptionItem = { label: string; value: string };

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.scss'],
  standalone: false
})
export class PlaygroundPage {
  name = '';
  selectedCategory: string | null = null;
  selectedDate: Date | null = null;

  categories: OptionItem[] = [
    { label: 'Alimentación', value: 'food' },
    { label: 'Transporte', value: 'transport' },
    { label: 'Vivienda', value: 'home' },
    { label: 'Salud', value: 'health' },
    { label: 'Ocio', value: 'fun' },
    { label: 'Salario', value: 'salary' },
    { label: 'Otros', value: 'other' },
  ];

  showDialog = false;

  constructor(private messageService: MessageService) {}

  openDialog() {
    this.showDialog = true;
  }

  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Listo',
      detail: 'PrimeNG Toast funcionando ✅',
    });
  }
}
