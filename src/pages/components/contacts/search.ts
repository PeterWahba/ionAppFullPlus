import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController} from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../providers/database/database';
import { Observable } from "rxjs/Observable";


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
    contact: any;
    contactArray : any=[]; 
    contactList : any=[]; 
    loadedContactList:  any=[]; 
    
    constructor(public loadingCtrl: LoadingController, public db: DatabaseProvider, public navCtrl: NavController) {

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();
  
      let that = this;
      db.getAllCollections('contact')
          .then(function (e) {
              if (!!e) {
                  console.log(e);
                  that.contact = Observable.of(e);
                  that.contactArray = e;
                  that.contactList = e; // for ngFor loop 
                  that.loadedContactList = e; 
              }
              loadingPopup.dismiss()
          });  
  }


  initializeItems(){
    this.contactList = this.loadedContactList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }
    this.contactList = this.contactList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.contactList.length);

  }

  gotoDetails(contact) {
      this.navCtrl.push('DetailsProfileSocialPage', { contact: contact }); 
  }

}
