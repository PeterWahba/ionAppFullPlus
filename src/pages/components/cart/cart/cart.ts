import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from "../../../../providers/database/database";
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the CartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
    })

export class CartPage {
    alertOptions: any;
    total: number;
    view: string = 'cart';

    uid: any= null;
    cartItems: Array<CartItem>;
    historyItems: Array<CartItem>;
    constructor(private navCtrl: NavController, private navParams: NavParams, private loadingCtrl: LoadingController, private db: DatabaseProvider, private afAuth: AngularFireAuth,
        public alertCtrl: AlertController) {
        this.loadData();
        if (this.navParams.get('goToHistory') == true) {
            this.switchView('history');
        }

    }

    switchView(view) {
        this.view = view;
    }

    qtyChanged(item) {
        
        this.db.updateDocument('cart', item.$key, item).then((e) => {
            console.log(item.qty);
            this.loadData();
        })

    }

    loadData() {
        let loadingPopup = this.loadingCtrl.create({
            spinner: 'crescent',
            content: ''
        });
        loadingPopup.present();

        let that = this;
        this.afAuth.authState.subscribe(userAuth => {
            if (!userAuth) {
                this.showLoginChoise();
                loadingPopup.dismiss();
                return;
            }

            this.uid = !!userAuth ? userAuth.uid : null;
            this.db.getDocuments('cart', ['uid', '==', this.uid])
                .then(function (e) {
                    if (!!e) {
                        let cart = e.filter((x) => {
                            return !x.bought
                        });

                        let history = e.filter((x) => {
                            return x.bought
                        });
                        
                        that.cartItems = cart;
                        that.historyItems = history;

                        //calculate total
                        that.total = 0;
                        cart.forEach((x) => {
                            let finalPice = x.discount ? x.discoutPrice : x.price;
                            that.total += finalPice * x.qty;
                        })
                    } else {
                        that.total = 0;
                        that.cartItems = null;
                    }
                    loadingPopup.dismiss();
                });
        });

        
        
    }

    showLoginChoise() {
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

    deleteConfirm(key) {
        let prompt = this.alertCtrl.create({
            title: 'Delete',
            message: "Are you sure you want to delete this item?",

            buttons: [
                {
                    text: 'Yes',
                    handler: data => {
                        this.deleteItem(key);
                        this.loadData();
                    }
                },
                {
                    text: 'No',
                    handler: data => {
                        
                    }
                }
            ]
        });
        prompt.present();
    }


    deleteItem(key) {
        this.db.deleteDocument('cart', key).then((e) => {
         
            this.loadData();
        });
  }


  checkout() {
      this.navCtrl.push('CheckoutPage', { total: this.total, items: this.cartItems});
  }

  goToItemDescription(item) {
      if (item.type == 'shopping') {
          this.navCtrl.push('ShoppingDetailPage', { itemId: item.categoryKey, subDoc: item.itemKey });
      } else if (item.type == 'restaurant') {
          this.navCtrl.push('RestaurantDetailPage', { itemId: item.categoryKey, subDoc: item.itemKey });
      }

  }

}





interface CartItem {
    type: string;
    categoryKey: string;
    itemKey: string;
    img: string;
    price: number;
    name: string;
    uid: string;
    qty: number;
    $key: string;
}