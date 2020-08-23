import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage({
  name: 'QrHomePage',
  segment: 'qr-home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class QrHomePage {

  scannedCode = null;
 
  constructor(private barcodeScanner: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams) { }
 
 
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData);
      this.scannedCode = barcodeData.text;
      this.navCtrl.push('QrDetailsPage', {'data': barcodeData.text, saveToDb: true});
    }, (err) => {
        console.log('Error: ', err);
        alert('Error: ' + JSON.stringify(err));
    });
  }

   
  gotoCreate(){
    this.navCtrl.push('QrCreatePage');
  }

  gotoCreateOptions(){
    this.navCtrl.push('CreateOptionsPage');
  }
  
  gotoHistory(){
    this.navCtrl.push('QrHistoryPage');
  }

  gotoOcr(){
    this.navCtrl.push('OcrPage');
  }

  

}
