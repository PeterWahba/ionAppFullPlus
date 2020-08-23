import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWeblinkPage } from './create-weblink';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    CreateWeblinkPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateWeblinkPage),
    NgxQRCodeModule
  ],
})
export class CreateWeblinkPageModule {}
