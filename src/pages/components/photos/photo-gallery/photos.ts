import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, PopoverController, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';
//*********** Import image gallery **************//
import { GalleryModal } from 'ionic-gallery-modal';
import { AngularFireAuth } from "angularfire2/auth";

import * as firebase from 'firebase';
import 'firebase/firestore';
import { FirestoreStorageProvider } from "../../../../providers/firestore-storage/firestore-storage";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Instagram } from "@ionic-native/instagram";

@IonicPage()
@Component({
    selector: 'page-photos',
    templateUrl: 'photos.html'
})
export class PhotosPage {
    src: string;
    uid: string;
    loaded: boolean;
    imgPhotos: any;
    imgPhotosArray: any = [];

    photos: any[] = [];
    getIndex: number;

    //*********** View mode  **************/
    photosView: string = "four";

    private dbf: any;



    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public modalCtrl: ModalController,
        public db: DatabaseProvider, public popoverCtrl: PopoverController, public afAuth: AngularFireAuth, private actionSheetCtrl: ActionSheetController
        , private toastCtrl: ToastController, private storage: FirestoreStorageProvider, private alertCtrl: AlertController, private socialSharing: SocialSharing
        , private instagram: Instagram) {
        // Initialise access to the firestore service
        this.dbf = firebase.firestore();

        this.afAuth.authState.subscribe(userAuth => {

            if (!userAuth) {
                console.log('auth false');
                this.navCtrl.setRoot('LoginPage');
            } else {
                this.uid = userAuth.uid;
            }
        });

        let toast = this.toastCtrl.create({
            message: 'Hold the image to open menu',
            position: 'bottom',
            showCloseButton: true
        });
        toast.present();
    }


    ionViewWillEnter() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let loadingPopup = this.loadingCtrl.create({
            spinner: 'crescent',
            content: ''
        });
        loadingPopup.present();

        this.dbf.collection('gallery')
            .where('uid', '==', this.uid)
            .get()
            .then(function (e) {
                if (!!e) {

                    let arr = [];
                    e.forEach(function (doc) {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        console.log(obj)
                        arr.push(obj);
                    });

                    console.log(e)
                    that.imgPhotosArray = arr;
                }
                loadingPopup.dismiss();
            });
    }


    fullscreenImage(getIndex) {
        //console.log("NEW ==== getIndex="+getIndex);
        let modal = this.modalCtrl.create(GalleryModal, {
            // For multiple images //
            photos: this.imgPhotosArray,
            // For single image //
            // photos: [{url:getImage}], 
            closeIcon: 'close-circle',
            initialSlide: getIndex
        });
        // console.log("getIndex="+getIndex);
        modal.present();
    }

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create('PhotosPopoverPage');
        popover.present({
            ev: myEvent
        });

        popover.onDidDismiss(data => {
            switch (data) {
                case 1:
                    this.photosView = 'one'
                    break;
                case 2:
                    this.photosView = 'two'
                    break;
                case 3:
                    this.photosView = 'three'
                    break;
                case 4:
                    this.photosView = 'four'
                    break;
            }
        })
    }

    gotoUpload() {
        this.navCtrl.push('UploadPhotoPage');
    }

    openContextual(image, event) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select option',
            buttons: [
                {
                    text: 'Open with Google Vision',
                    handler: () => {
                        this.navCtrl.push('GoogleCloudVisionPage', {imgUrl: event.target});
                    }
                },
                {
                    text: 'Open with face recognition',
                    handler: () => {
                        this.navCtrl.push('AzureFaceRecognitionPage', {imgUrl: event.target});
                    }
                },
                {
                    text: 'Share on instagram',
                    handler: () => {
                        let base64 = this.getBase64Image(event.target);
                        this.instagram.share(base64, 'This was copied to your clipboard!')
                        .then(() => {
                          // Image might have been shared but you can't be 100% sure
                        })
                        .catch(err => {
                          // Handle error
                          console.error(err);      
                        })
                    }
                },
                {
                    text: 'Share...',
                    handler: () => {
                        let base64 = this.getBase64Image(event.target);
                        this.socialSharing.share("Checkout this image: ", "Checkout this image: "/*Subject*/, base64/*File*/, null /*url*/)
                            .then(() => {
                                console.log("General share Success");
                            },
                            () => {
                                console.log("General share failed");
                                this.showNoDeviceAlert();
                            });
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        let loadingPopup = this.loadingCtrl.create({
                            spinner: 'crescent',
                            content: ''
                        });
                        loadingPopup.present();
                        this.storage.deleteFile('gallery', image).toPromise().then((e) => {
                            this.loadData();
                            loadingPopup.dismiss();
                        }).catch((e) => {
                            console.log(e);
                            loadingPopup.dismiss();
                            alert('Error deleting file');
                        })

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    getBase64Image(img) {
        let canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL("image/jpeg");
        this.src = dataURL;
        return dataURL;
        //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
      

    showNoDeviceAlert() {
        let alert = this.alertCtrl.create({
            title: 'Attention',
            subTitle: 'You are running your code on a desktop browser, to be able to use this feature you need to run it on a device or emulator',
            buttons: ['OK']
        });
        alert.present();
    }
}
