import { Component, ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController, ModalController, Platform, AlertController} from 'ionic-angular';

import { DatabaseProvider } from '../../../../providers/database/database';
import { GalleryModal } from 'ionic-gallery-modal';
import { CallNumber } from "@ionic-native/call-number";

@IonicPage({
    name: "MapSubDetailPage",
    segment: "map-sub-details"
})
@Component({
  selector: 'page-map-sub-detail',
  templateUrl: 'map-sub-detail.html'
})
export class MapSubDetailPage {
    favorite: boolean;
  mapId: any;
  map: any;

  //****** Variables for fading header *******//
  showToolbar:boolean = false;
  transition:boolean = false;
  headerImgSize:string = '100%';
  headerImgUrl:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public viewCtrl: ViewController,
      public loadingCtrl: LoadingController, private toastCtrl: ToastController, public db: DatabaseProvider, public modalCtrl: ModalController, public platform: Platform,
      public alertCtrl: AlertController, private callNumber: CallNumber) {
    let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
    });
    loadingPopup.present();   
    this.mapId = this.navParams.get('mapId');
    let that = this;
    db.getDocumentsByName('map', this.mapId)
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.map = e;
            }
            loadingPopup.dismiss();
        });
  }

    closeModal() {
        this.viewCtrl.dismiss();
    }

 //*********** Fading header  **************/
    onScroll($event: any){
        let scrollTop = $event.scrollTop;
        this.showToolbar = scrollTop >= 100;
        if(scrollTop < 0){
            this.transition = false;
            this.headerImgSize = `${ Math.abs(scrollTop)/2 + 100}%`;
        }else{
            this.transition = true;
            this.headerImgSize = '100%'
        }
        this.ref.detectChanges();
    }

    addToFav() {
        this.favorite = !this.favorite;
        this.presentToast('bottom', 'Add to Favorite');
    }


    presentToast(position: string, message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            position: position,
            duration: 1000
        });
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
    }

    private dismissHandler() {
        console.info('Toast onDidDismiss()');
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
