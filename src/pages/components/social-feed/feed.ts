import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController , LoadingController} from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../providers/database/database';
import { Observable } from "rxjs/Observable";
import { GalleryModal } from 'ionic-gallery-modal';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})

export class FeedPage {

  feeds: any;
  feedView: string = "activity";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
      public db: DatabaseProvider) {
 
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
   
    let that = this;
    db.getAllCollections('feed')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.feeds = Observable.of(e);
            }
            loadingPopup.dismiss()
        });
  }


  //*********** Open image fullscreen**************/
  openFullImage(getIndex, imgGallery) {
      let modal = this.modalCtrl.create(GalleryModal, {
          // For multiple images //
          photos: imgGallery,
          // For single image //
          // photos: [{url:getImage}], 
          closeIcon: 'close-circle',
          initialSlide: getIndex
      });
      modal.present();
  }

}
