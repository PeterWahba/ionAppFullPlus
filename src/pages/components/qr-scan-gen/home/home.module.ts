import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrHomePage } from './home';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    QrHomePage,
  ],
  imports: [
    IonicPageModule.forChild(QrHomePage)
  ],
  providers:[
    BarcodeScanner,
  ]
})
export class QrHomePageModule {}
