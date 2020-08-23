import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create-options',
  templateUrl: 'create-options.html',
})
export class CreateOptionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  gotoWifi(){
    this.navCtrl.push('CreateWifiPage');
  }

  gotoGeo(){
    this.navCtrl.push('CreateGeoPage');
  }

  gotoWeblink(){
    this.navCtrl.push('CreateWeblinkPage');
  }

  gotoText(){
    this.navCtrl.push('QrCreatePage');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateOptionsPage');
  }

}
