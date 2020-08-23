import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ViewController } from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../../providers/database/database';
declare var google;

@IonicPage({
    name: "CityListMapPage",
    segment: "places-list-map"
})
@Component({
  selector: 'page-list-map',
  templateUrl: 'list-map.html'
})
export class CityListMapPage {
    subDoc: any;
  @ViewChild('map') mapElement: ElementRef;
  categoryId:any
  items: any[] = [];

  map: any;
  markerSelected: boolean = false;
  //******************** Map style  **************************//
  //***** go to snazzymaps.com for more map style  ***********//
  //**********************************************************//
  mapStyle: any = [{"featureType":"landscape.man_made","elementType":"all","stylers":[{"color":"#faf5ed"},{"lightness":"0"},{"gamma":"1"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5a6"}]},{"featureType":"road","elementType":"all","stylers":[{"weight":"1.00"},{"gamma":"1.8"},{"saturation":"0"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ffb200"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"gamma":"1"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"hue":"#b000ff"},{"saturation":"23"},{"lightness":"-4"},{"gamma":"0.80"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#a0daf2"}]}];

  infoWindows: any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public viewCtrl: ViewController,
      public db: DatabaseProvider) {

      let loadingPopup = this.loadingCtrl.create({
          spinner: 'crescent',
          content: ''
      });
      loadingPopup.present();

      this.categoryId = this.navParams.get('categoryId');
      this.subDoc = this.navParams.get('subDoc');

      let that = this;


      if (!!this.subDoc) {
          db.getSubCategoryDocByname('places', this.categoryId, 'sub', this.subDoc)
              .then(function (e) {
                  if (!!e) {
                      that.items = e;
                  }
                  that.displayGoogleMap();
                  loadingPopup.dismiss()
              });
      }
      else {
          db.getSubCategoryDocs('places', this.categoryId, 'sub')
              .then(function (e) {
                  if (!!e) {
                      that.items = e;
                  }
                  that.displayGoogleMap();
                  loadingPopup.dismiss()
              });
      }
  }



  displayGoogleMap() {
    let latLng = new google.maps.LatLng(13.801532791932946, 100.54677690766607);
    let mapOptions = {
        center: latLng,
        zoom: 18,
        styles: this.mapStyle,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarkersToMap(this.items)
  }


  addMarkersToMap(item) {
      if (item && item.length > 0) {
          item.forEach((i) => {
              this.setupMap(i);
          });
      } else {
          this.setupMap(item);
      }
  }

  setupMap(item) {
      var position = new google.maps.LatLng(item.lat, item.lng);
      var mapMarker = new google.maps.Marker({
          position: position,
          animation: google.maps.Animation.DROP,
          markerSelected: true,
          title: item.name,
          email: item.email,
          web: item.web,
          phone: item.phone,

          //**** Custom Marker Symbols ****/
          //icon:  'assets/red_pin72x96.png'
          icon: {
              url: 'assets/red_pin72x96.png',
              //The size image file.
              size: new google.maps.Size(72, 96),
              // we want to render @ 30x30 logical px (@2x dppx or 'Retina')
              scaledSize: new google.maps.Size(40, 52),
              //The point on the image to measure the anchor from. 0, 0 is the top left.
              origin: new google.maps.Point(0, 0),
              //The x y coordinates of the anchor point on the marker. e.g. If your map marker was a drawing pin then the anchor would be the tip of the pin.
              anchor: new google.maps.Point(20, 40),
              labelOrigin: new google.maps.Point(20, 12)
          },
          anchorPoint: new google.maps.Point(0, -40)
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
      this.map.setCenter(position);
  }





  addInfoWindowToMarker(marker) {

      var infoWindowContent = '<div id="iw-container">' +               
                                  '<div class="iw-content">' +
                                        '<div class="iw-subTitle">'+marker.title+'</div>' +                                  
                                        '<br><b>Phone:</b> '+marker.phone+'<br><b>E-mail:</b>'+marker.email+'<br><b>Website:</b> '+marker.web+'</p>'+
                                  '</div>' +
                                  //'<div id="do-something-button">button</div>' +
                              '</div>';    

      var infoWindow = new google.maps.InfoWindow();
          // infoWindow.setOptions({
          //     disableAutoPan:false
          // }); 
          infoWindow.setContent(infoWindowContent);

          marker.addListener('click', () => {
                this.closeAllInfoWindows();
                infoWindow.open(this.map, marker);
                // add listener that will capture the click event of the infoWindow
                // google.maps.event.addListener(infoWindow, 'domready', () => {
                //   document.getElementById('do-something-button').addEventListener('click', () => {
                //      this.doSomething();
                //   });
                // }); 

          });
          this.infoWindows.push(infoWindow);
  }

  doSomething(){
    console.log("doSomething");
  }

  closeAllInfoWindows() {
      for(let window of this.infoWindows) { 
        window.close();
      }
  }
 

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
