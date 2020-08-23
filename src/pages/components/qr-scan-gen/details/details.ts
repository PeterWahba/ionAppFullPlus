import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Hotspot } from '@ionic-native/hotspot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SqliteDatabaseProvider } from './../../../../providers/database-sqlite/database';
import { TextProcessorProvider } from './../../../../providers/text-processor/text-processor';

@IonicPage({
  name: 'QrDetailsPage',
  segment: 'qr-details'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class QrDetailsPage {
  datetime: any;
  saveToDb: boolean;
  result: any;
  scannedCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts, private platform: Platform
    , private callNumber: CallNumber, public alertCtrl: AlertController, private launchNavigator: LaunchNavigator
  ,private hotspot: Hotspot, private socialSharing: SocialSharing, private databaseprovider: SqliteDatabaseProvider, private txtProcessor: TextProcessorProvider,
  ) {
    this.scannedCode = this.navParams.get('data');
    this.datetime = this.navParams.get('datetime');
    this.saveToDb = this.navParams.get('saveToDb');
    
    this.result = this.txtProcessor.processText(this.scannedCode, this.datetime);
    
  }

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.addScanned(this.result.text, this.result.date);
    });
  }

   
  addScanned(text, datetime) {
    if (this.saveToDb) {
      this.databaseprovider.addScanned(text, datetime)
        .then(data => {
          this.txtProcessor.presentToast('bottom', 'Scan saved');
        });
    }else{
     //this.presentToast('bottom', 'Nothing to save')
    }
  }


  fetchContact(text) {
    let obj: any = {}
    //let a = 'MECARD:N:Eismann Oreilly;TEL:001234567;URL:www.qrworld.wordpress.com;EMAIL:dummymail@yahoo.com;;'.split(';')
    if (!!text) {
      let arr = text.split(';');
      arr.forEach((e: any) => {
        if (!!e) {
          if (e.indexOf('MECARD:N:') > -1) {
            obj.name = e.split('MECARD:N:')[1].replace(';', '');
          }
          if (e.indexOf('TEL:') > -1) {
            obj.telf = e.split('TEL:')[1].replace(';', '');
          }
          if (e.indexOf('ADR:') > -1) {
            obj.addr = e.split('ADR:')[1].replace(';', '');
          }
          if (e.indexOf('URL:') > -1) {
            obj.url = e.split('URL:')[1].replace(';', '');
          }
          if (e.indexOf('EMAIL:') > -1) {
            obj.email = e.split('EMAIL:')[1].replace(';', '');
          }
          if (e.indexOf('NOTE:') > -1) {
            obj.note = e.split('NOTE:')[1].replace(';', '');
          }
        }

      });
      return obj;
    }
    return null;
  }


  addContact(data) {
    this.platform.ready().then(() => {
      if (typeof data == 'object') {
        if (!data.name || !data.telf) {
          return;
        }

        let fullName = data.name.split(' ');
        let telf = data.telf.split('-').join('').split('(').join('').split(')').join('');

        let contact: Contact = this.contacts.create();

        contact.name = new ContactName(null, fullName[0], fullName[1]);
        contact.phoneNumbers = [new ContactField('mobile', telf)];
        contact.save().then(
          () => {
            this.txtProcessor.presentToast('bottom', 'Contact saved');
            console.log('Contact saved!', contact);
          },
          (error: any) => {
            this.txtProcessor.presentToast('bottom', 'Error saving contact');
            console.error('Error saving contact.', error);
          }
        );
      }
    });
  }

  connectToWifi(ssid, pass){
    this.txtProcessor.presentToast('bottom', 'Trying to connect to wifi');
    this.hotspot.connectToWifi(ssid, pass).then(()=>{
      console.log('Connected to wifi');
      this.txtProcessor.presentToast('bottom', 'Connected to wifi');
    }).catch((err)=>{
      this.txtProcessor.presentToast('bottom', 'Not able to connect to wifi');
      console.log('Not able to connect to wifi ', err)      
    })
  }
  
  launchGeo(data) {
    let lat= data.lat;
    let lon = data.lon;
    let label = 'map'
    let destination = lat + ',' + lon;

    if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
    } else {
        let l = encodeURI(label);
        window.open('geo:0,0?q=' + destination + '(' + l + ')', '_system');
    }
}

  launchNavigation(destination) {
    this.launchNavigator.navigate(destination)
      .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
      );
    // if (this.platform.is('ios')) {
    //   window.open('maps://?q=' + destination, '_system');
    // } else {
    //   window.open('geo:0,0?q=' + destination, '_system');
    // }
  }

  sendEmail(email) {
    if (!!email) {
      window.open('mailto:' + email, '_system');
    } else {
      this.txtProcessor.presentToast('bottom', 'No email to send');
    }
  }

  openLink(link){
    if (!!link) {
      if(link.indexOf('http://')>-1 || link.indexOf('https://')>-1){
        window.open(link, '_system');
      }else{
      window.open('http://:' + link, '_system');
      }
    } else {
      this.txtProcessor.presentToast('bottom', 'No email to send');
    }
  }

  

  makeCall(number) {
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
          this.txtProcessor.presentToast('bottom', 'launching dialer Failed');
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

  share(result) {
    let msg = null;
    let subject = null;
    let url = null;

    if (result.type == 'weblink') {
      url = result.data.link;
    } else if (result.type == 'wifi') {
      msg = 'SSID: '+  result.data.ssid + ' Password: ' + result.data.pass;
    } else if (result.type == 'text' || result.type == 'upc') {
      msg = result.text;
    } else if (result.type == 'geo') {
      let destination = result.data.lat + ',' + result.data.lon;
      let label = 'map';
      let uri = '';
      if (this.platform.is('ios')) {
        uri = 'maps://?q=' + destination;
      } else {
        let l = encodeURI(label);
        uri = 'geo:0,0?q=' + destination + '(' + l + ')';
        url = uri;
      }
    }
    this.socialSharing.share(msg, subject/*Subject*/, null/*File*/, url)
      .then(() => {
        console.log("General share Success");
      },
      (e) => {
        console.log("Share failed ", e);
        this.txtProcessor.presentToast('bottom', 'Share failed');
      })

  }
}
