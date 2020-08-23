import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Loading, Platform } from 'ionic-angular';

import { Http } from '@angular/http';
import * as papa from 'papaparse';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from "@ionic-native/social-sharing";

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-csv-visualize-export',
  templateUrl: 'csv-visualize-export.html',
})
export class CsvVisualizeExportPage {
  j: any;
  i: any;
  inputEditingData: '';
  showEditng: boolean = false;
  editingData: any;
  td: any;
  storageDirectory: any;
  localDummyDataPath: string = './assets/data.csv';
  path: string = '';
  loadingPopup: Loading;
  url: string;
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private transfer: FileTransfer, private file: File,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController, private fileOpener: FileOpener, private platform: Platform,
    private socialShare: SocialSharing) {
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    if (!this.platform.is('cordova')) {
      alert('This functionality must run on a device or emulator');
      return;
    }

    let url = this.navParams.get('url') || `${cordova.file.applicationDirectory}www/assets/data.csv`;//get the url from previous page as a parameter or use local assets/data.csv file

    this.platform.ready().then(() => {

      this.loadingPopup.present();
      //always transfer file from the url, either from internet or from assets folder
      this.transferFileFromUrl(url).then((f) => {
        this.readCsvData(f);
        this.loadingPopup.dismiss();
      });
    });
  }

  transferFileFromUrl(url) {
    return new Promise((resolve, reject) => {
      const fileTransfer: FileTransferObject = this.transfer.create();

      this.path = this.file.dataDirectory + `file_data${this.rand()}.csv`;
      fileTransfer.download(url, this.path).then((entry) => {
        resolve(this.path);
        console.log('download complete: ' + entry.toURL());
        this.presentToast('bottom', 'Download completed');
      }, (error) => {
        console.log(error);
        alert(JSON.stringify(error));
        reject(error);
      });
    });
  }

  rand() {//generate a random number, used to concat with the file name of the downloaded csv to create a unique name
    let d = new Date();
    var x = Math.floor((Math.random() * 1000) + 1) + d.getTime();
    return x;
  }

  private readCsvData(url) {
    this.loadingPopup.present();
    this.http.get(url).subscribe(data => {
      this.extractData(data);
      this.loadingPopup.dismiss();
    }, err => {
      this.handleError(err);
      this.loadingPopup.dismiss();
    });
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    this.headerRow = parsedData[0];

    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }

  share(){
    if (!!this.path) {
      this.socialShare.share('CSV file export', 'CSV export', this.path, '');
    } else{
      alert('No file to share');
    }
  }

  downloadCSV() {
    //open the csv file with the default app on your device
    this.fileOpener.open(this.path, 'application/csv')
      .then(() => {
        this.presentToast('bottom', 'File is open')
      })
      .catch(e => {
        this.presentToast('bottom', 'Error opening file');
        console.log('Error opening file', e);
      });
  }

  private handleError(err) {
    console.log('something went wrong: ', err);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 2500
    });
    toast.present();
  }

  setActive($event, i, j){
    console.log($event);
    $event.target.style.border = "thick solid #0000FF";
    this.i = i;
    this.j = j;
    this.td = $event;
    this.inputEditingData = this.csvData[i][j];
    this.showEditng = true;
  }

  saveData(){
    this.csvData[this.i][this.j] = this.inputEditingData;
    this.td.target.style.border = "";
    this.showEditng = false;
    this.inputEditingData = '';
  }

  closeEditing(){
    this.td.target.style.border = "";
    this.showEditng = false;
    this.inputEditingData = '';
    this.i = 0;
    this.j = 0;
  }

}
