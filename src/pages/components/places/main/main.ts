import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, PopoverController } from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { DatabaseProvider } from '../../../../providers/database/database';
//import { PopoverPage } from './popover';

@IonicPage({
    name: 'CityCategoryPage',
    segment: 'city-category-reference'
})
@Component({
  selector: 'page-category-place',
  templateUrl: 'main.html'
})
export class CityCategoryPage {
  category: any[] = [];
  viewType: string = "list";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
      private callNumber: CallNumber, public alertCtrl: AlertController, private sms: SMS, public db: DatabaseProvider, public popoverCtrl: PopoverController) {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    
    let that = this;
    db.getAllDocuments('places')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.category = e;
            }
            loadingPopup.dismiss()
        });
  }


  //*********** Open list page  **************/
  openList(obj){
      this.navCtrl.push('CityListPage', { categoryId:obj.$key, name: obj.name, obj: obj}); 
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
      } else{
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


    presentToast(position: string, message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            position: position,
            duration: 1000
        });
        toast.present();
    }
    
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create('PopoverPage');
        popover.present({
            ev: myEvent
        });
        
        popover.onDidDismiss(data => {
            switch (data) {
                case 1:
                    this.navCtrl.push('RatePage', { headerColor: 'cyan', appName: 'Discover Places' }); 
                    break;
                case 2:
                    this.navCtrl.push('AboutPage'); 
                    break;
            }
        });
    }
}
