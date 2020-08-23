import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../../providers/database/database';

//*********** Import image gallery **************//
import { GalleryModal } from 'ionic-gallery-modal';
import { CallNumber } from "@ionic-native/call-number";
import { googleMapsApi } from "../../../../config/config";


@IonicPage({
    name: 'CityDetailPage',
    segment: 'city-detail-page'
})
@Component({
  selector: 'city-page-detail',
  templateUrl: 'detail.html'
})
export class CityDetailPage {
    name: any;
    subDoc: any;
  rate: any  ;
  favorite: boolean = false;
    
  showToolbar:boolean = false;
  transition: boolean = false;

  itemId: any;
  item: any;
  itemImages: any;
  imgGallery : any=[]; 

  mapKey = googleMapsApi;
  
  photos: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private toastCtrl: ToastController,
      public ref: ChangeDetectorRef, public db: DatabaseProvider, public platform: Platform, public alertCtrl: AlertController, private callNumber: CallNumber) {
    
      this.itemId = this.navParams.get('itemId');
      this.subDoc = this.navParams.get('subDoc');
      this.name = this.navParams.get('name');

      let that = this;
      db.getSubCategoryDocByname('places', this.itemId, 'sub', this.subDoc)
          .then(function (e) {
              if (!!e) {
                  that.item = e;
                  that.imgGallery = e.images
              }
          });
  }

  //*********** Fading header  **************/
  onScroll($event: any){
        let scrollTop = $event.scrollTop;
        this.showToolbar = scrollTop >= 100;
        if(scrollTop < 0){
            this.transition = false;
            //this.headerImgSize = `${ Math.abs(scrollTop)/2 + 100}%`;
        }else{
            this.transition = true;
           // this.headerImgSize = '100%'
        }
        this.ref.detectChanges();
  }


  showMap() {
     let mapModal = this.modalCtrl.create('CityListMapPage', {
         categoryId: this.itemId, subDoc: this.subDoc
    });
    mapModal.present();
 }

//*********** Open image fullscreen**************/
openFullImage(getIndex) {
  let modal = this.modalCtrl.create(GalleryModal,  {
      // For multiple images //
      photos:   this.imgGallery ,
      // For single image //
      // photos: [{url:getImage}], 
     closeIcon: 'close-circle',
     initialSlide: getIndex 
    });
  modal.present();
 }

  addToFav() {
    this.favorite = !this.favorite;
    this.presentToast('bottom','Add to Favorite');
  }


  presentToast(position: string,message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 1000
    });
  toast.present();
  }

  fullscreenImage(getImage) {
      let modal = this.modalCtrl.create(GalleryModal, {
          // For multiple images //
          //photos: this.imgGalleryArray,
          // For single image //
           photos: [{url:getImage}], 
          closeIcon: 'close-circle',
          //initialSlide: getIndex
      });
      modal.present();
  }

  launchNavigation(latitude, longitude, label = 'map') {
      let destination = latitude + ',' + longitude;

      if (this.platform.is('ios')) {
          window.open('maps://?q=' + destination, '_system');
      } else {
          let label = encodeURI('My Label');
          window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }
  }

  MakeCall(number) {
      if (!(<any>window).cordova) {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
          return;
      }
      if (this.callNumber.isCallSupported()) {
          this.callNumber.callNumber(number, true)
              .then(() => {
                  console.log('Launched dialer!')
              })
              .catch(() => {
                  this.presentToast('bottom', 'launching dialer Failed');
                  console.log('Error launching dialer')
              });
      } else {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
      }
  }
}
