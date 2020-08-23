import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { Calendar } from '@ionic-native/calendar';
import { DatabaseProvider } from '../../../providers/database/database';
import { GalleryModal } from 'ionic-gallery-modal';


@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage {
  list: any;
  feedView: string = "activity";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public modalCtrl: ModalController,
      private calendar: Calendar, public alertCtrl: AlertController, public db: DatabaseProvider) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      let that = this;
      db.getAllCollections('timeline')
          .then(function (e) {
              if (!!e) {
                  console.log(e);
                  that.list = e;
              }
              loadingPopup.dismiss()
          });

  }

  openCalendar() {
      if (!(<any>window).cordova) {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
          return;
      }

      this.calendar.openCalendar(new Date()).then(
          (msg) => { console.log(msg); },
          (err) => { alert(err); }
      );
  }

  fullscreenImage(getImage) {
      let modal = this.modalCtrl.create(GalleryModal, {
          // For multiple images //
          //photos: this.imgGalleryArray,
          // For single image //
          photos: [{ url: getImage }],
          closeIcon: 'close-circle',
          //initialSlide: getIndex
      });
      modal.present();
  }

}
