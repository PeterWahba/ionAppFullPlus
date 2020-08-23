import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController} from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';
import { Observable } from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-profile-tabs',
  templateUrl: 'profileTabs.html'
})
export class ProfileTabsPage {

    profile:  any;
    imgGallery: any;
    friends:  any;
    imgGalleryArray : any=[]; 

    segmentView: string = "one";
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
                  that.profile = Observable.of(firstOrDefault);
                  that.friends = firstOrDefault.friends;
              }

              db.getAllCollections('gallery')
                  .then(function (e) {
                      if (!!e) {
                          let o = e.filter((x)=>{
                            return !x.uid
                          })
                          that.imgGallery = Observable.of(o);
                          that.imgGalleryArray = o;
                      }
                  });

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
