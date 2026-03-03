import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './pages/dashboard/dashboard.page';

@NgModule({
  declarations: [DashboardPage],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
