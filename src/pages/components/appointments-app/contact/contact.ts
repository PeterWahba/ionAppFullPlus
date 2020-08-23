import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { GalleryModal } from 'ionic-gallery-modal';
import { mapInfo } from "../../../../config/config";

declare var google;

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})

export class ContactPage {
  times: number = 0;
  @ViewChild('map') mapElement: ElementRef;
  photos: any[];
  address: string;
  phoneNumber: string;
  workHours: any[];
  reviews: any[];
  placeId: string;
  lon: number;
  lat: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.placeInfo();
    this.setUpMap();
  }

  setUpMap() {
    let that = this;
    this.platform.ready().then(() => {

      var map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: that.lat, lng: that.lon },
        zoom: 15
      });

      var infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);

      service.getDetails({
        placeId: that.placeId
      }, function (place, status) {

        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          alert('Error');
          return;
        }

        // that.ngzone.run(() => {
        //   that.photos = [];
        //   if (place && place.photos && place.photos.length > 0) {
        //     place.photos.forEach((e) => {
        //       that.photos.push(e.getUrl({ 'maxWidth': 200, 'maxHeight': 200 }));
        //     })
        //   }
        //   that.address = place.formatted_address || '';
        //   that.phoneNumber = place.formatted_phone_number || '';
        //   that.workHours = place.opening_hours? place.opening_hours.weekday_text: [];
        //   that.reviews = place.reviews || [];

        // })


        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          map.setCenter(place.geometry.location);
          google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
              place.formatted_address + '</div>' + '<br>'
            );
            infowindow.open(map, this);
          });
        }
      });
    })
  }

  launchNavigation() {
    let label = 'map'
    let destination = this.lat + ',' + this.lon;

    if (this.platform.is('ios')) {
      window.open('maps://?q=' + destination, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }
  }

  openFullImage(getImage) {
    let that = this;
    let modal = this.modalCtrl.create(GalleryModal, {
      // For multiple images //
      //photos:   that.photos ,
      // For single image //
      photos: [{ url: getImage }],
      closeIcon: 'close-circle',
      //initialSlide: getIndex 
    });
    modal.present();
  }


  placeInfo() {
    this.photos = mapInfo.photos;
    this.address = mapInfo.address;
    this.phoneNumber = mapInfo.phoneNumber;
    this.workHours = mapInfo.workHours;
    this.reviews = mapInfo.reviews;


    // let key = 'AIzaSyA6orYvg_XXOlsh_FkUkh1jigDPoDgOvbo';
    // let input = '13755%20SW%2042nd%20St%20b,%20Miami,%20FL%2033175';
    // let fields = 'place_id,photos,formatted_address,name,rating,opening_hours,geometry';

    this.lat = mapInfo.lat;
    this.lon = mapInfo.lon;
    this.placeId = mapInfo.placeId;
  }

}
