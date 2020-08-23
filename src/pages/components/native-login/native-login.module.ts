import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NativeLoginPage } from './native-login';

@NgModule({
  declarations: [
    NativeLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(NativeLoginPage),
  ],
  exports: [
    NativeLoginPage
  ]
})
export class NativeLoginPageModule {}
