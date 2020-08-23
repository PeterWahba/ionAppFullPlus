import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { SqliteDatabaseProvider } from './../../../../providers/database-sqlite/database';
import { TextProcessorProvider } from './../../../../providers/text-processor/text-processor';

@IonicPage({
  name: 'QrHistoryPage',
  segment: 'qr-history'
})
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class QrHistoryPage {
  scanneds: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider, 
    private toastCtrl: ToastController) {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadScannedData();
      }
    })
  }

  loadScannedData() {
    this.databaseprovider.getAllScanneds().then(data => {
      
      if (data) {
        let arr = [];
        let obj:any = {};
        data.forEach((x)=>{
          obj = this.txtProcessor.processText(x.content);
          obj.id = x.id;
          obj.date = x.datetime;
          arr.push(obj);
        });
        this.scanneds = arr;
      }
    }).catch((e)=>{
      this.presentToast('bottom', 'Error lloading item');
      console.log('Error loading item ', e);

    });
  }

  removeItem(id){
   
    this.databaseprovider.removeScanned(id).then(()=>{
      this.loadScannedData();
    }).catch((e)=>{
      this.presentToast('bottom', 'Error deleting item');
      console.log('Error deleting item ', e);

    });
  }

  openDetails(text, datetime){
    this.navCtrl.push('QrDetailsPage', {'data': text,'datetime':datetime, 'saveToDb': false});
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 2000
    });
    toast.present();
  }

}
