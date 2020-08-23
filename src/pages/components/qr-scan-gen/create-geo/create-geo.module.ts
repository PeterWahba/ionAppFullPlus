import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGeoPage } from './create-geo';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    CreateGeoPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateGeoPage),
    NgxQRCodeModule
  ],
})
export class CreateGeoPageModule {}
