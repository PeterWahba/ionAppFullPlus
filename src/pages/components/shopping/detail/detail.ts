import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController, AlertController } from 'ionic-angular';

import { DatabaseProvider } from '../../../../providers/database/database';

import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { GalleryModal } from "ionic-gallery-modal";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage({
    name: 'ShoppingDetailPage',
    segment: 'shopping-detail-page'
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class ShoppingDetailPage {
    uid: string;
    favorite: boolean;
    subDoc: any;

  itemId: any;
  item: any;
  totalItemsInCart: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
      public db: DatabaseProvider, public modalCtrl: ModalController, public afAuth: AngularFireAuth, public alertCtrl: AlertController) {
      this.itemId = this.navParams.get('itemId');
      this.subDoc = this.navParams.get('subDoc');

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      let that = this;
      db.getSubCategoryDocByname('shopping', this.itemId, 'sub', this.subDoc)
          .then(function (e) {
              if (!!e) {
                  console.log(e);
                  that.item = e;
              }
              loadingPopup.dismiss()
          });

      this.getTotalItemsOnCart();

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

  addToCart() {

      this.afAuth.authState.subscribe(userAuth => {
          if (!userAuth) {
              this.showLoginChoices();
              return;
          }

          this.uid = userAuth.uid;
          let price = !!this.item.discount ? this.item.discountPrice : this.item.price;

          this.db.getDocuments('cart', ['uid', '==', userAuth.uid]).then((x) => {
           
              if (!!x || (!!x && x.length > 0)) {

                  var exist = x.filter((i) => {
                      return i.itemKey == this.subDoc;
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
              type: this.item.type,
              categoryKey: this.itemId,
              itemKey: this.subDoc,
              img: this.item.imgSmall,
              price: price,
              name: this.item.name,
              uid: this.uid,
              qty: 1
          }).then(() => {
              const toast = this.toastCtrl.create({
                  message: 'Item added to cart',
                  position: 'bottom',
                  duration: 3000
              });
              toast.present();
              this.getTotalItemsOnCart();

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

  buyNow() {
      this.navCtrl.push('CartPage');
  }

  fullscreenImage(getImage) {
      let modal = this.modalCtrl.create(GalleryModal, {
          // For multiple images //
          //photos: this.imgGalleryArray,
          // For single image //
          photos: [{ url: getImage }],
          closeIcon: 'close-circle',
          //initialSlide: getIndex
      });
      modal.present();
  }


  addToFav() {
      this.favorite = !this.favorite;
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


}
