import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CropperPhotoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cropper-photo-modal',
  templateUrl: 'cropper-photo-modal.html',
})
export class CropperPhotoModalPage {
  croppedImage: any;
  

  constructor(
    public params: NavParams,
    private navCtrl: NavController,
    public viewCtrl: ViewController
  ) {
   
    this.croppedImage = this.params.get('croppedImage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  gotoUpload(){
    this.navCtrl.push('UploadPhotoPage', {image: this.croppedImage });
  }
}
