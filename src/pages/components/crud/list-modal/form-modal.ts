import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { DatabaseProvider } from '../../../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-form-modal',
  templateUrl: 'form-modal.html'
})
export class FormModalPage {
  contacts: any;
 
  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
      public db: DatabaseProvider) {
      let that = this;
      db.getAllCollections('profile')
          .then(function (e) {
              if (!!e) {
                  console.log(e)
                  that.contacts = Observable.of(e);
              }
          });

  }

  selectContact(name,id,imgProfile) {
    console.log("selectContact id = "+id);
    let dataArray = {
      name: name,
      id: id,
      imgProfile: imgProfile
    };
    this.viewCtrl.dismiss(dataArray);
  }


}
