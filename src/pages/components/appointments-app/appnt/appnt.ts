import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from "../../../../providers/database/database";


@IonicPage()
@Component({
  selector: 'page-appnt',
  templateUrl: 'appnt.html',
})
export class AppntPage {
  employees: any = [];
  searchTerm: string = '';
  items: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider) {
    
    this.db.getAllCollections('employees').then((d)=>{
        this.employees = d;
        this.setFilteredItems();
    })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AppntPage');
  }
 
  setFilteredItems() {
      this.items = this.filterItems(this.employees, this.searchTerm);
  }

  filterItems(items, searchTerm) {
    if (searchTerm != '') {
        return items.filter((item) => {
          item.displayName = item.displayName || ''; 
          item.description = item.description || ''; 
            return item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            || item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
    } else {
        return items;
    }
  }

  apptDetails(employeeObj){
    this.navCtrl.push('ApptdetailsPage', {emp: employeeObj});
  }

  selectNextAvailable(){
    
  }

}
