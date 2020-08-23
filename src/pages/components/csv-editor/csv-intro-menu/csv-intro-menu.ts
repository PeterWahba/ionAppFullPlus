import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-csv-intro-menu',
  templateUrl: 'csv-intro-menu.html',
})
export class CsvIntroMenuPage {
  showUrlInput: boolean = false;
  url: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  loadDummyData(){
    this.navCtrl.push('CsvVisualizeExportPage');
  }
  
  loadFromUrl(){
    if(this.checkCsvExtention(this.url)){
      this.navCtrl.push('CsvVisualizeExportPage', {url: this.url});
    }else{
      alert('Invalid extention')
    }
  }

  checkCsvExtention(url){
    return /.+\.csv$/g.test(url);
  }

}
