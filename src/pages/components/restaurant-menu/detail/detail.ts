import { Component, ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../../providers/database/database';
import { Observable } from "rxjs/Observable";
import { GalleryModal } from "ionic-gallery-modal";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage({
    name: 'RestaurantDetailPage',
    segment: 'restaurant-detail-page'
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class RestaurantDetailPage {
    uid: string;
    prodName: any;
    subDoc: any;
    totalItemsInCart: number;

  itemId: any;
  item: any;
  itemOption: any;
  itemSize: any;

  itemOptionArray: any=[]; 
  itemSizeArray: any = [];
  favorite: boolean = false;
    
  showToolbar:boolean = false;
  transition:boolean = false;
  headerImgSize:string = '100%';
  headerImgUrl:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public ref: ChangeDetectorRef,
      private toastCtrl: ToastController, public db: DatabaseProvider, public modalCtrl: ModalController, public afAuth: AngularFireAuth, public alertCtrl: AlertController) {
     
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent', 
        content: ''
      });
      loadingPopup.present();     

      this.itemId = this.navParams.get('itemId');
      this.subDoc = this.navParams.get('subDoc');
      this.prodName = this.navParams.get('prodName');
      
      let that = this;
      db.getSubCategoryDocByname('restaurant', this.itemId, 'sub', this.subDoc)
          .then(function (e) {
              if (!!e) {
                  console.log(e);
                  that.item = e;
                  that.itemOption = Observable.of(e.options);
                  that.itemOptionArray = e.options || [];
                  that.itemSize = Observable.of(e.size);
                  that.itemSizeArray = e.size || [];
              }
              loadingPopup.dismiss()
          });
      
      this.getTotalItemsOnCart();
  }


  onScroll($event: any){
        let scrollTop = $event.scrollTop;
        this.showToolbar = scrollTop >= 100;
        if(scrollTop < 0){
            this.transition = false;
            this.headerImgSize = `${ Math.abs(scrollTop)/2 + 100}%`;
        }else{
            this.transition = true;
            this.headerImgSize = '100%'
        }
        this.ref.detectChanges();
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

    
}
