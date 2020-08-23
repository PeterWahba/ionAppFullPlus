import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, PopoverController, Platform, AlertController, ToastController } from 'ionic-angular';

import { DatabaseProvider } from '../../../../providers/database/database';
import { CallNumber } from "@ionic-native/call-number";
import { googleMapsApi } from "../../../../config/config";

@IonicPage({
    name: 'RestaurantCategoryPage',
    segment: 'restaurant-category-reference'
})
@Component({
  selector: 'page-category-restaurant',
  templateUrl: 'main.html'
})

export class RestaurantCategoryPage {
  viewType: string = "Menu";
  categories: any[] = [];
  items: any[] = [];
  restaurantInfo: {} = {
      address: '123 sw 123 st',
      phone: '(123)-123-1234',
      web: 'www.webpage.com',
      lat: '25.7418723',
      lng: '-80.3510726',
      location: 'Miami, FL'
  };
  
  mapKey = googleMapsApi;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
      public db: DatabaseProvider, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public platform: Platform, public alertCtrl: AlertController,
      private callNumber: CallNumber, private toastCtrl: ToastController) {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', 
      content: ''
    });
    loadingPopup.present();

    let that = this;
    db.getAllDocuments('restaurant')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.categories = e;
                let promoArr = [];

                e.forEach((p) => { 
                    db.getSubCategoryCondition('restaurant', p.$key, 'sub', ['promotion', '==', true])
                    .then(function (promotions) {
                        
                        if (!!promotions) {
                            promotions.forEach((k) => {
                                k.$parentKey = p.$key;
                            })
                            promoArr.push.apply(promoArr, promotions);
                        }
                    });
                });
                that.items = promoArr;
            }

            loadingPopup.dismiss()
        });
      
  }


  showMap() {
      let mapModal = this.modalCtrl.create('RestaurantMapPage', { info: this.restaurantInfo });
      mapModal.present();
  }

  openList(obj){
      this.navCtrl.push('RestaurantListPage',{categoryId:obj.$key, name: obj.name }); 
  }

  goToDetail(obj){
      this.navCtrl.push('RestaurantDetailPage', { itemId: obj.$parentKey, subDoc: obj.$key}); 
  }

  presentPopover(myEvent) {
      let popover = this.popoverCtrl.create('RestaurantPopoverPage');
      popover.present({
          ev: myEvent
      });

      popover.onDidDismiss(data => {
          switch (data) {
              case 1:
                  this.viewType = 'Menu'
                  break;
              case 2:
                  this.viewType = 'Promotion'
                  break;
              case 3:
                  this.viewType = 'About'
                  break;
          }
      });
  }

  launchNavigation(latitude, longitude, label = 'map') {
      let destination = latitude + ',' + longitude;

      if (this.platform.is('ios')) {
          window.open('maps://?q=' + destination, '_system');
      } else {
          let label = encodeURI('My Label');
          window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }
  }

  MakeCall(number) {
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
          this.callNumber.callNumber(number, true)
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

  presentToast(position: string, message: string) {
      let toast = this.toastCtrl.create({
          message: message,
          position: position,
          duration: 1000
      });
      toast.present();
  }

  launchBotChat(){
      this.navCtrl.push("DialogflowChatPage");
  }
    
}
