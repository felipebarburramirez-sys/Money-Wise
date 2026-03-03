import { NgModule } from '@angular/core';
import { TabsRoutingModule } from './tabs-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { TabsPage } from './pages/tabs/tabs.page';

@NgModule({
  declarations: [TabsPage],
  imports: [SharedModule, TabsRoutingModule],
})
export class TabsModule {}
