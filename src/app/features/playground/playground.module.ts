import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PlaygroundRoutingModule } from './playground-routing.module';

import { PlaygroundPage } from './pages/playground/playground.page';

@NgModule({
  declarations: [PlaygroundPage],
  imports: [SharedModule, PlaygroundRoutingModule],
})
export class PlaygroundModule {}
