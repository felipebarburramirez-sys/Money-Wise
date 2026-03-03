import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TransaccionesRoutingModule } from './transacciones-routing.module';

import { ListaTransaccionesPage } from './pages/lista-transacciones/lista-transacciones.page';
import { DetalleTransaccionPage } from './pages/detalle-transaccion/detalle-transaccion.page';

@NgModule({
  declarations: [ListaTransaccionesPage, DetalleTransaccionPage],
  imports: [SharedModule, TransaccionesRoutingModule],
})
export class TransaccionesModule {}
