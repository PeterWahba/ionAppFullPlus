import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWifiPage } from './create-wifi';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    CreateWifiPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateWifiPage),
    NgxQRCodeModule
  ],
})
export class CreateWifiPageModule {}
