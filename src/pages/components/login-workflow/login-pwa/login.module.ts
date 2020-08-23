import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPwaPage } from './login';

@NgModule({
  declarations: [
      LoginPwaPage,
  ],
  imports: [
      IonicPageModule.forChild(LoginPwaPage),
  ],
  exports: [
      LoginPwaPage
  ]
})
export class LoginPageModule {}
