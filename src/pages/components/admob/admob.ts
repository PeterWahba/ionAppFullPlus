import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { AdmobProvider } from '../../../providers/admob/admob'
/**
 * Generated class for the AdmobPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-admob',
  templateUrl: 'admob.html',
})
export class AdmobPage {
    isDevice: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public admobFree: AdmobProvider, public alertCtrl: AlertController) {
    let that = this;
    this.platform.ready().then(() => {
      that.admobFree.prepareBanner().then(() => {
          that.admobFree.showBanner(null);
      });  
  });

  }

  showInterstitial(){
    let that = this;
    this.platform.ready().then(() => {
      that.admobFree.prepareInterstitial().then(() => {
          that.admobFree.showInterstitial();
      });
  });
    }

  showVideoReward() {
      let that = this;
      this.platform.ready().then(() => {
          that.admobFree.prepareVideo().then(() => {
              that.admobFree.showVideo();
          });
      });
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad AdmobPage');
      if (!(<any>window).cordova) {
          // running on desktop browser
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'You are running your code on a desktop browser, to be able to use this feature you need to run it on a device or emulator',
              buttons: ['OK']
          });
          alert.present();
      }
  }

  ionViewWillLeave(){
    this.admobFree.hideBanner();
  }

}
