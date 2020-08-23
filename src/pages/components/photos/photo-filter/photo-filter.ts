import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-photo-filter',
  templateUrl: 'photo-filter.html',
})
export class PhotoFilterPage {
  selectedFilter = null;
  image = '';
  level = 1;
  result: HTMLElement;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  imageLoaded(e) {
    // Grab a reference to the canvas/image
    this.result = e.detail.result;
  }

  ionViewDidLoad() {
    this.image = this.navParams.get('image');
    if(!this.image){
      alert('No image was passed');
      this.navCtrl.pop();
    }
  }

  filter(selected, level?) {
    this.selectedFilter = selected;
    this.level = level ? level : 1;
  }
 
  saveImage() {
    if (!this.selectedFilter) {
      // Use the original image!
      this.navCtrl.push('UploadPhotoPage', {image: this.image}) 
    } else {
      let canvas = this.result as HTMLCanvasElement;
      // export as dataUrl or Blob!
      let base64 = canvas.toDataURL('image/jpeg', 1.0);
      // Do whatever you want with the result!
      this.navCtrl.push('UploadPhotoPage', {image: base64}) 
    }
  }

}
