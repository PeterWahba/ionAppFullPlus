import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';
import { Observable } from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-profile-corporate',
  templateUrl: 'profileCorporate.html'
})
export class ProfileCorporatePage {
  following: boolean = false;
  profile: any;

  //*********** Variables for fading header **************//
  showToolbar:boolean = false;
  transition:boolean = false;
  headerImgSize:string = '100%';
  headerImgUrl:string = '';
  //****************************//


  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public loadingCtrl: LoadingController,
      public ref: ChangeDetectorRef, public db: DatabaseProvider) {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loading.present();

      let that = this;
      db.getDocuments('profile', ['position', '==', 'corporate'])
          .then(function (e) {
              if (!!e) {
                  console.log(e[0])
                  that.profile = Observable.of(e[0]);
              }
              loading.dismiss()
          });
  }


  //*********** Fading header  **************/
  onScroll($event: any){
        let scrollTop = $event.scrollTop;
        this.showToolbar = scrollTop >= 80;
        if(scrollTop < 0){
            this.transition = false;
        }else{
            this.transition = true;
        }
        this.ref.detectChanges();
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
