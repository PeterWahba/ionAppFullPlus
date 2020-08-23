import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { FirebaseStorageProvider } from "../../../providers/firebase-storage/firebase-storage";

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from "@ionic-native/social-sharing";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-signature-pad',
  templateUrl: 'signature-pad.html',
})
export class SignaturePadPage {
  uid: any;
  signature = '';
  isDrawing = false;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };

  files: Observable<any[]>;
  tab: string = 'pad';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private toastCtrl: ToastController,
    private storageProvider: FirebaseStorageProvider, private iab: InAppBrowser, private socialSharing: SocialSharing
    , public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(userAuth => {

      if (userAuth) {
        this.uid = userAuth.uid;
      }else{
        this.navCtrl.setRoot('LoginPage');
      }
    });
    this.loadData();
  }

  ionViewDidEnter() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
    this.storage.get('savedSignature').then((data) => {
      this.signature = data;
    });
  }

  drawComplete() {
    this.isDrawing = false;
  }

  drawStart() {
    this.isDrawing = true;
  }

  savePad() {
    this.signature = this.signaturePad.toDataURL();
    this.storage.set('savedSignature', this.signature);
    this.signaturePad.clear();
    this.presentToast('New Signature saved.');
    this.uploadInformation(this.signature);//upload to firebase storage and to the db 
  }

  clearPad() {
    this.signaturePad.clear();
  }


  //firebase store data
  loadData() {
    this.files = this.storageProvider.getFiles();
  }


  uploadInformation(data) {
    let upload = this.storageProvider.uploadToStorage(data, 'png');

    // Perhaps this syntax might change, it's no error here!
    upload.then(res => {
      res.metadata['uid'] = this.uid
      this.storageProvider.storeInfoToDatabase(res.metadata).then(() => {
        this.presentToast('New File added!');
      });
    });
  }

  deleteFile(file) {
    this.storageProvider.deleteFile(file).subscribe(() => {
       this.presentToast('File removed');
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }


  share(url) {
    let c = document.createElement('canvas');
    let ctx = c.getContext("2d");
    var img = new Image();
    img.src = url;
    ctx.drawImage(img, img.width, img.height);
    let dataUrl = c.toDataURL("image/png");
    dataUrl = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

    this.socialSharing.share('Checkout my signature: ', 'Checkout my signature: '/*Subject*/, null/*File*/, dataUrl)
      .then(() => {
        console.log("General share Success");
      },
      (e) => {
        console.log("Share failed ", e);
        this.presentToast('Share failed');
      })

  }

  presentToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

}
