import { Component } from '@angular/core';
import { NavController, ActionSheetController, IonicPage, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import * as Tesseract from 'tesseract.js'
import { SqliteDatabaseProvider } from "../../../../providers/database-sqlite/database";
import { TextProcessorProvider } from "../../../../providers/text-processor/text-processor";


@IonicPage({
  name: 'OcrPage',
  segment: 'qr-ocr'
})
@Component({
  selector: 'page-ocr',
  templateUrl: 'ocr.html',
})
export class OcrPage {
  selectedImage: string;
  imageText: string;
 
  constructor(public navCtrl: NavController, private camera: Camera, private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider) {
  }
 
  selectSource() { 
    this.imageText = '';   
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }
 
  recognizeImage() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', 
      content: ''
    });
    loadingPopup.present();
    Tesseract.recognize(this.selectedImage)
    .progress(message => {
      if (message.status === 'recognizing text'){
        console.log('recognizing text');
      }
    })
    .catch(err => console.error(err))
    .then(result => {
      this.imageText = result.text;
    })
    .finally(resultOrError => {
      console.log('completed recognizing text');
      loadingPopup.dismiss();
    });
  }

  save(imageText){
    if (imageText){
      let datetime = this.txtProcessor.getDatetime();
      this.databaseprovider.addScanned(imageText, datetime)
        .then(data => {
          this.txtProcessor.presentToast('bottom', 'Text saved');
        });
    }
  }
}
