
import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";

@Injectable()
export class TextProcessorProvider {

  constructor( private toastCtrl: ToastController) {
  }

  getDatetime(){
    let date = new Date();
    let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return date.toLocaleString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' }) + ' - ' + time;
  }

  processText(text, datetime = null) {
    if(!datetime){
      datetime = this.getDatetime();
    }


    let obj: any = {};
    obj.date = datetime;
    obj.type = '';
    obj.text = text;
    obj.icon = '';
    obj.launchable = false;
    obj.data = {};

    let weblink = /^(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
    //let calendar = /^BEGIN:VCALENDAR(\n.+)+/g;
    let geo = /^geo:[0-9,\.\- ]+,[0-9,\.\- ]+[\?\=\'\w\, ]+/g;
    let wifi = /^WIFI:.*;P:.*;;$/g;
    //let contact = /^MECARD:.+/g;
    let upc = /^[0-9]{12,14}/g;

    if (weblink.test(text)) {
      obj.type = 'weblink';
      obj.icon = 'link';
      obj.launchable = true;
      obj.data.link = text;
    }
    //  else if (calendar.test(text)) {
    //   obj.type = 'calendar';
    //   obj.icon = 'calendar';
    //   obj.launchable = true;
    // } 
    else if (geo.test(text)) {
      obj.type = 'geo';
      obj.icon = 'navigate';
      obj.launchable = true;
      obj.data = this.fetchGeo(text);
    } else if (wifi.test(text)) {
      obj.type = 'wifi';
      obj.icon = 'wifi';
      obj.launchable = true;
      obj.data = this.fetchWifi(text);
    } 
    // else if (contact.test(text)) {
    //   obj.type = 'contact';
    //   obj.icon = 'contact';
    //   obj.launchable = true;
    //   obj.data = this.fetchContact(text);
    // }
     else if (upc.test(text)) {
      obj.type = 'upc';
      obj.icon = 'barcode';
      obj.launchable = false;
    } else {
      obj.type = 'text';
      obj.icon = 'text';
      obj.launchable = false;
    }
    return obj;
  }
  fetchWifi(wifi){
    if(!wifi){
      this.presentToast('bottom','No wifi info');
      return;
    }
    let obj:any = {};
    let arr = wifi.split(';');
    arr.forEach(e => {
      if(!!e){
        if(e.indexOf('WIFI:') >-1){
          obj.ssid = e.split('WIFI:S:')[1];
        }
        if(e.indexOf('P:') >-1){
          obj.pass = e.split('P:')[1];
        }
      }
    });
    return obj;
  }


  fetchGeo(geo){
    if(!geo){
      this.presentToast('bottom','No Address info');
      return;
    }

    let obj:any = {};
    let exp = /^geo:([0-9,\.\- ]+),([0-9,\.\- ]+)([\?\=\'\w\, ]+)/g;
    let arr = exp.exec(geo);

    if(!!arr[1]){
      obj.lat = arr[1]
    }

    if(!!arr[2]){
      obj.lon = arr[2]
    }
    return obj;
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 2000
    });
    toast.present();
  }

}
