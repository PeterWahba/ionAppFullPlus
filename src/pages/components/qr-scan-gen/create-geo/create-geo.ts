import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteDatabaseProvider } from "../../../../providers/database-sqlite/database";
import { TextProcessorProvider } from "../../../../providers/text-processor/text-processor";


@IonicPage()
@Component({
  selector: 'page-create-geo',
  templateUrl: 'create-geo.html',
})
export class CreateGeoPage {
  lon: string;
  lat: string;
  qrData = null;
  createdCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider) {
  }

  createCode() {
    let geo = 'geo:'+this.lat + ',' + this.lon;
    this.createdCode = geo;
  }

  save() {
    if (this.createdCode) {
      let datetime = this.txtProcessor.getDatetime();
      this.databaseprovider.addScanned(this.createdCode, datetime)
        .then(data => {
          this.txtProcessor.presentToast('bottom', 'Text saved');
        });
    }
  }

}
