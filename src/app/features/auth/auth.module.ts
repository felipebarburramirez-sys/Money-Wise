import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UiModule } from '../../shared/ui/ui.module';

import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

@NgModule({
  declarations: [LoginPage, RegisterPage],
  imports: [SharedModule, AuthRoutingModule, UiModule, IonicModule],
})
export class AuthModule {}
