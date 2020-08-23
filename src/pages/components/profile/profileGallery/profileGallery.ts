import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';
import { Observable } from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-profile-gallery',
  templateUrl: 'profileGallery.html'
})
export class ProfileGalleryPage {


  profile:  any;
  imgGallery: any;
  imgGalleryArray:any=[]; 
  friends: any;
  following: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
      public db: DatabaseProvider) {
     
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent', 
        content: ''
      });
      loadingPopup.present();   

      let that = this;
      db.getDocuments('profile', ['position', '==', 'CEO'])
          .then(function (e) {
              let firstOrDefault = e[0];
              if (!!firstOrDefault) {
                  console.log(firstOrDefault)
                  that.profile = Observable.of(firstOrDefault);

                  that.friends = Observable.of(firstOrDefault.firends);
                  that.imgGallery = Observable.of(firstOrDefault.imgGallery);
                  that.imgGalleryArray = firstOrDefault.imgGallery;
              }
              loadingPopup.dismiss()
          });

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
