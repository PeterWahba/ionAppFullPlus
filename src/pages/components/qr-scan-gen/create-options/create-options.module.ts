import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOptionsPage } from './create-options';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    CreateOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateOptionsPage),
    NgxQRCodeModule
  ],
})
export class CreateOptionsPageModule {}
