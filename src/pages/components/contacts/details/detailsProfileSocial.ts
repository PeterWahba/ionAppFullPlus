import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController ,ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';

@IonicPage()
@Component({
  selector: 'details-profile-social',
  templateUrl: 'detailsProfileSocial.html'
})
export class DetailsProfileSocialPage {
  following: boolean = false;
  profile:  any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
      public db: DatabaseProvider) {

      this.profile = this.navParams.get('contact');
      
  }

  follow() {
    this.following = !this.following;
    this.presentToast('bottom','Follow user clicked');
  }

  presentToast(position: string,message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 1000
    });
    toast.present();
  }

}
