import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Loading } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { AngularFireAuth } from "angularfire2/auth";
import { FirestoreStorageProvider } from "../../../../providers/firestore-storage/firestore-storage";

@IonicPage()
@Component({
    selector: 'page-upload-photo',
    templateUrl: 'upload-photo.html',
})
export class UploadPhotoPage {
    uid: any;
    captureDataUrl: string = null;

    lastImageData: any;
    loading: Loading;
    collectionName: string = 'gallery';
    fileRefName: string = 'gallery';

    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private actionSheetCtrl: ActionSheetController,
        private toastCtrl: ToastController,
        private storage: FirestoreStorageProvider, public afAuth: AngularFireAuth) {

    }

    ionViewWillEnter() {

        if (!!this.navParams.get('image')) {//if an image was passed back from the filter and crop functionality
            this.lastImageData = this.navParams.get('image');
            this.captureDataUrl = this.navParams.get('image');
        }
        this.afAuth.authState.subscribe(userAuth => {
            if (!userAuth) {
                console.log('auth false');
                this.navCtrl.setRoot('LoginPage');
            } else {
                this.uid = userAuth.uid;
            }
        });
    }

    ionViewDidLeave() {
        this.lastImageData = null;
        this.captureDataUrl = null;
    }


    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
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

    editImage() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select edit option',
            buttons: [
                {
                    text: 'Crop',
                    handler: () => {
                        this.navCtrl.push('PhotoCropperPage', { image: this.captureDataUrl });
                    }
                },
                {
                    text: 'Filters',
                    handler: () => {
                        this.navCtrl.push('PhotoFilterPage', { image: this.captureDataUrl });
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

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            this.lastImageData = imagePath;
            this.captureDataUrl = 'data:image/jpeg;base64,' + imagePath;

        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }



    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }


    public uploadImage() {
        let upload = this.storage.uploadToStorage(this.fileRefName, this.captureDataUrl, 'jpg');

        upload.then(res => {
            let metadata: any = res.metadata;
            metadata.uid = this.uid;
            console.log(metadata);
            this.storage.storeInfoToDatabase(this.collectionName, metadata).then(() => {
                let toast = this.toastCtrl.create({
                    message: 'New File added!',
                    duration: 3000
                });
                toast.present();
            });
            this.navCtrl.push('PhotosPage');
        }).catch((e) => {
            if (!!e && e.code.indexOf('unauthorized') > -1) {
                let toast = this.toastCtrl.create({
                    message: 'Unauthorized You need to login to be able to upload the image',
                    duration: 3000
                });
                toast.present();
            }
            console.log(e);
        });
    }
}
