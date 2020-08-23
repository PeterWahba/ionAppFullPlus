import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage,NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../../../providers/database/database';

// import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
// import { GalleryModal } from 'ionic-gallery-modal';
// declare var google;

@IonicPage({
    name: 'CityListPage',
    segment: 'city-list-page'
})
@Component({
  selector: 'page-list-place',
  templateUrl: 'list.html'
})
export class CityListPage {
    segmentView: string;
    parent: any;
    name: any;
  @ViewChild('map') map3Element: ElementRef;
  categoryId:any
  items: any[] = [];

  viewMode: string = "map";
  map: any;
  mapList: any;
  mapListArray : any=[]; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
      public db: DatabaseProvider) {

      this.segmentView = 'one';
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    this.categoryId = this.navParams.get('categoryId');
    this.name = this.navParams.get('name');
    this.parent = this.navParams.get('obj');


    let that = this;
    db.getSubCategoryDocs('places', this.categoryId, 'sub')
        .then(function (e) {
            if (!!e) {
                console.log(e)
                that.items = e;
            }
            loadingPopup.dismiss()
        });
  }
  goToDetail(obj){
      this.navCtrl.push('CityDetailPage', { itemId: this.categoryId, subDoc: obj.$key, name: obj.name}); 
  }


 showMap() {
    let mapModal = this.modalCtrl.create('CityListMapPage', { 
    categoryId:this.categoryId
    });
    //let profileModal = this.modalCtrl.create(MapDetailPage, {lat: deviceNum,lng:lng});
    mapModal.present();
 }

}
