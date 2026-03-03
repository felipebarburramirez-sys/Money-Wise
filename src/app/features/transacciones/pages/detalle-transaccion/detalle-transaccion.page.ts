import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-transaccion',
  templateUrl: './detalle-transaccion.page.html',
  styleUrls: ['./detalle-transaccion.page.scss'],
  standalone: false,
})
export class DetalleTransaccionPage {
  id = this.route.snapshot.paramMap.get('id') ?? '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/tabs/transacciones');
  }
}
