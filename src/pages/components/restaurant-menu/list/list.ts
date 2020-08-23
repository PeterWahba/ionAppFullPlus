import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';

@IonicPage({
    name: 'RestaurantListPage',
    segment: 'restaurant-list-page'
})
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class RestaurantListPage {
    name: any;
  categoryId:any;
  items: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
      public db: DatabaseProvider) {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', 
      content: ''
    });
    loadingPopup.present();
      
    this.categoryId = this.navParams.get('categoryId');
    this.name = this.navParams.get('name');

    let that = this;
    console.log(this.categoryId);
    db.getSubCategoryDocs('restaurant',this.categoryId, 'sub')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.items = e;
            }
            loadingPopup.dismiss()
        });

  }

  goToDetail(obj) {
      this.navCtrl.push('RestaurantDetailPage', { itemId: this.categoryId, subDoc: obj.$key, prodName: obj.name }); 
  }


}
