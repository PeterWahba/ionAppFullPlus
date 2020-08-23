import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteDatabaseProvider } from "../../../../providers/database-sqlite/database";
import { TextProcessorProvider } from "../../../../providers/text-processor/text-processor";

@IonicPage()
@Component({
  selector: 'page-create-weblink',
  templateUrl: 'create-weblink.html',
})
export class CreateWeblinkPage {
  link = null;
  createdCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider) {
  }

  createCode() {
    this.createdCode = this.link;
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
