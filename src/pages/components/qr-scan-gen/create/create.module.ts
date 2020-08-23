import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCreatePage } from './create';

import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    QrCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(QrCreatePage),
    NgxQRCodeModule
  ],
})
export class QrCreatePageModule {}
