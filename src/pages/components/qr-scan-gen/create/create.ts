import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SqliteDatabaseProvider } from './../../../../providers/database-sqlite/database';
import { TextProcessorProvider } from './../../../../providers/text-processor/text-processor';

@IonicPage({
  name: 'QrCreatePage',
  segment: 'qr-create'
})
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class QrCreatePage {
  qrData = null;
  createdCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider) {
  }

  createCode() {
    this.createdCode = this.qrData;
  }

  save() {
    if (this.createdCode){
      let datetime = this.txtProcessor.getDatetime();
      this.databaseprovider.addScanned(this.createdCode, datetime)
        .then(data => {
          this.txtProcessor.presentToast('bottom', 'Text saved');
        });
    }
  }

}
