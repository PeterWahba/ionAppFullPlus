import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleCloudVisionProvider } from "../../../providers/google-cloud-vision/google-cloud-vision";

@IonicPage()
@Component({
  selector: 'page-google-cloud-vision',
  templateUrl: 'google-cloud-vision.html',
})
export class GoogleCloudVisionPage {
  image: any;
  imageData: string;
  results: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertController, private vision: GoogleCloudVisionProvider) {
  }

  ionViewDidLoad() {
    let url = this.navParams.get('imgUrl');
    if (url) {
      this.analyzeImg(url.currentSrc);
    }
  }

  imageAnalysis(imageData){
    
    this.vision.getLabels(imageData).subscribe((result) => {
      let results =  result.json().responses;
      if(results && results[0]){
        this.results = results[0].labelAnnotations.map((x)=>{
          return x.description;
        });
      }
    }, err => {
      this.showAlert(err);
    });
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  analyzeImg(url){ //convert from url to bas64
      let img = document.createElement("img");//create an img element on the fly and assign the url 
      img.crossOrigin="Anonymous";
      img.onload = ()=>{
        let canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL();
        //this.src = dataURL;
        //return dataURL;
        let result = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        this.imageData = result;
        this.image = url;
        this.imageAnalysis(result);
      };
      img.src = url;
      
  }

  gotoGallery() {
    this.navCtrl.push('PhotosPage');
  }


}
