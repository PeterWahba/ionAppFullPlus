import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import {IntroPage} from '../components/intro/intro'; 

/**
 * Generated class for the OfflinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html',
})
export class OfflinePage {

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public network: Network, public alertCtrl: AlertController) {
    let that = this;    
   this.network.onConnect().subscribe((e) => {
      this.platform.ready().then(() => {
          let confirmAlert = that.alertCtrl.create({
              title: "Connection Status",
              subTitle: 'You are connected to the internet!!',
              buttons: [ {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  console.log('Ok clicked');
                  that.navCtrl.setRoot(IntroPage);
                }
              }]
          });
          confirmAlert.present();
      });
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflinePage');
  }

}
