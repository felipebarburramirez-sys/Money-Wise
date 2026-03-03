import { Component } from '@angular/core';
import { Router } from '@angular/router';

type TxItem = { id: string; title: string; amount: number };

@Component({
  selector: 'app-lista-transacciones',
  templateUrl: './lista-transacciones.page.html',
  styleUrls: ['./lista-transacciones.page.scss'],
  standalone: false
})
export class ListaTransaccionesPage {
  items: TxItem[] = [
    { id: '1', title: 'Café', amount: 8000 },
    { id: '2', title: 'Transporte', amount: 12000 },
  ];

  constructor(private router: Router) {}

  openDetail(id: string) {
    this.router.navigate(['/tabs/transacciones', id]);
  }
}
