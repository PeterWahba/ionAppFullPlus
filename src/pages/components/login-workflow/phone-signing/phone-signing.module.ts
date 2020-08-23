import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneSigningPage } from './phone-signing';

@NgModule({
  declarations: [
    PhoneSigningPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneSigningPage),
  ],
})
export class PhoneSigningPageModule {}
