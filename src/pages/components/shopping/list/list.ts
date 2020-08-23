import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { DatabaseProvider } from '../../../../providers/database/database';
import { AngularFireAuth } from "angularfire2/auth";


@IonicPage({
    name: 'ShoppingListPage',
    segment: 'shopping-list-page'
})
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ShoppingListPage {
    uid: string;
    favorite: any = [];
    name: string;
  categoryId:any;
  items: any[] = [];
  searchTerm: string = '';
  filteredItems: any; 
  totalItemsInCart: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public db: DatabaseProvider,
      private toastCtrl: ToastController, public afAuth: AngularFireAuth, public alertCtrl: AlertController) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      
      this.categoryId =  this.navParams.get('categoryId');
      this.name = this.navParams.get('name');
   
      console.log(this.categoryId);
      if (this.categoryId == undefined)
          return;

      loadingPopup.present();
      let that = this;
      db.getSubCategoryDocs('shopping', this.categoryId, 'sub')
          .then(function (e) {
              if (!!e) {
                  console.log(e)
                  that.items = e;
                  that.setFilteredItems();
              }
              loadingPopup.dismiss()
          });

      this.getTotalItemsOnCart();
}

  goToDetail(subDoc) {
      this.navCtrl.push('ShoppingDetailPage', { itemId: this.categoryId, subDoc: subDoc }); 
  }

  setFilteredItems() {
      this.filteredItems = this.filterItems(this.items, this.searchTerm);
  }

  filterItems(items, searchTerm) {
      //debugger;
      if (searchTerm != '') {
          return items.filter((item) => {
              return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
      } else {
          return items;
      }
  }

  addToFav(key) {
      this.favorite[key] = !this.favorite[key];
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

  buyNow(position: string) {
      this.navCtrl.push('CartPage');
  }

  addToCart(item) {
      let that = this;
      this.afAuth.authState.subscribe(userAuth => {
          if (!userAuth) {
              this.showLoginChoices();
              return;
          }

          this.uid = userAuth.uid;
          let price = !!item.discount ? item.discountPrice : item.price;
       
          this.db.getDocuments('cart', ['uid', '==', userAuth.uid]).then((x) => {
              if (!!x || (!!x && x.length > 0)) {
                  var exist = x.filter((i) => {
                      return i.itemKey == item.$key;
                  })

                  if (!!exist && exist.length > 0) {
                      //item already added to the cart
                      const toast = this.toastCtrl.create({
                          message: 'Item already added to the cart',
                          position: 'bottom',
                          duration: 3000
                      });
                      toast.present();
                      return;
                  }
              }

              this.db.addDocument('cart', {
                  type: item.type,
                  categoryKey: this.categoryId,
                  itemKey: item.$key,
                  img: item.imgSmall,
                  price: price,
                  name: item.name,
                  uid: this.uid,
                  qty: 1
              }).then(() => {
                  const toast = this.toastCtrl.create({
                      message: 'Item added to cart',
                      position: 'bottom',
                      duration: 3000
                  });
                  toast.present();
                  that.getTotalItemsOnCart();
              });

          });


      });
  }


  showLoginChoices() {
      let prompt = this.alertCtrl.create({
          title: 'Login',
          message: "You need to login to see your products in the cart, please select a login method",

          buttons: [
              {
                  text: 'Email/Pass login',
                  handler: data => {
                      this.navCtrl.push('LoginPage');
                  }
              },
              {
                  text: 'Social Login',
                  handler: data => {
                      this.navCtrl.push('NativeLoginPage');
                  }
              }
          ]
      });
      prompt.present();
  }

  getTotalItemsOnCart() {
      let that = this;
      this.afAuth.authState.subscribe(userAuth => {

          if (userAuth) {
              this.uid = !!userAuth ? userAuth.uid : null;
              this.db.getDocuments('cart', ['uid', '==', this.uid])
                  .then(function (e) {
                      if (!!e) {
                          let cart = e.filter((x) => {
                              return !x.bought
                          });

                          that.totalItemsInCart = cart.length;
                      }
                  });
          }
      });
  }


}
