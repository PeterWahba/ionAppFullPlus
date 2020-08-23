import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { DatabaseProvider } from '../../../../providers/database/database';


@IonicPage({
    name: 'ShoppingCategoryPage',
    segment: 'shopping-category-reference'
})
@Component({
  selector: 'page-category-shopping',
  templateUrl: 'main.html'
})
export class ShoppingCategoryPage {
    favorite: boolean;
    category: any[] = [];
    searchTerm: string = '';
    items: any; 


    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
        private callNumber: CallNumber, public alertCtrl: AlertController, private sms: SMS, public db: DatabaseProvider) {

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      let that = this;
      db.getAllDocuments('shopping')
          .then(function (e) {
              if (!!e) {
                  console.log(e)
                  that.category = e;
                  that.setFilteredItems();
              }
              loadingPopup.dismiss()
          });
  }

  openList(obj){
      this.navCtrl.push('ShoppingListPage', { categoryId: obj.$key, name: obj.name}); 
  }
    
  setFilteredItems() {
      this.items = this.filterItems(this.category, this.searchTerm);
  }

  filterItems(items, searchTerm) {
      if (searchTerm != '') {
          return items.filter((item) => {
              return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
      } else {
          return items;
      }
  }

  MakeCall() {
      if (!(<any>window).cordova) {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
          return;
      }
      if (this.callNumber.isCallSupported()) {
          this.callNumber.callNumber("18001010101", true)
              .then(() => {
                  console.log('Launched dialer!')
              })
              .catch(() => {
                  this.presentToast('bottom', 'launching dialer Failed');
                  console.log('Error launching dialer')
              });
      } else {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
      }
  }


  sendSMS() {
      if (!(<any>window).cordova) {
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'This platform is not compatible with this functionality',
              buttons: ['OK']
          });
          alert.present();
          return;
      }

      var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
              intent: 'INTENT'  // Opens Default sms app
              //intent: '' // Sends sms without opening default sms app
          }
      }
      this.sms.send('18001010101', 'Hello world!', options)
          .then(() => {
              this.presentToast('bottom', 'SMS success');
          }, () => {
              this.presentToast('bottom', 'SMS Failed');
          });
  }

  addToFav() {
      this.favorite = !this.favorite;
      this.presentToast('bottom', 'Add to Favorite');
  }

  presentToast(position: string, message: string) {
      let toast = this.toastCtrl.create({
          message: message,
          position: position,
          duration: 1000
      });
      toast.present();
  }

}
