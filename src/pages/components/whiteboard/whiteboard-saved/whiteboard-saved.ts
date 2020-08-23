import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, normalizeURL, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { SocialSharing } from "@ionic-native/social-sharing";

const STORAGE_KEY = 'IMAGE_LIST';

@IonicPage()
@Component({
  selector: 'page-whiteboard-saved',
  templateUrl: 'whiteboard-saved.html',
})
export class WhiteboardSavedPage {
  directory: any;

  storedImages = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public renderer: Renderer, private plt: Platform, private file: File
    , private toastCtrl: ToastController, private socialSharing: SocialSharing) {
    //check the platform to store in the right local file path
    if (this.plt.is('ios')) {
      this.directory = this.file.documentsDirectory;
    }
    else if (this.plt.is('android')) {
      this.directory = this.file.externalDataDirectory;
    }

  }

  ionViewDidEnter() {
    // Load all stored images when the app is ready
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });
  }

  removeImageAtIndex(index) {

    let removed = this.storedImages.splice(index, 1);
    this.file.removeFile(this.directory, removed[0].img).then(res => {
    }, err => {
      console.log('remove err; ', err);
    });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }

  getImagePath(imageName) {
    let path = this.directory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }

  share(url) {

    this.socialSharing.share('Checkout my image: ', 'Checkout my image: '/*Subject*/, null/*File*/, url)
      .then(() => {
        console.log("General share Success");
      },
      (e) => {
        console.log("Share failed ", e);
        this.presentToast('Share failed');
      })

  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}
