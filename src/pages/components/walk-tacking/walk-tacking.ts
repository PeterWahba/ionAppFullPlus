import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

declare var google;

@IonicPage()
@Component({
  selector: 'page-walk-tacking',
  templateUrl: 'walk-tacking.html',
})
export class WalkTackingPage {
  title: any;
  path: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousTracks = [];

  positionSubscription: Subscription;

  constructor(private navCtrl: NavController, private navParams: NavParams, private platform: Platform, private geolocation: Geolocation, private storage: Storage
    , private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadHistoricRoutes();
      this.loadMap();
      let route = this.navParams.get('route');
      if (route) {
        this.path = route.path;
        this.title = route.title;
        this.showHistoryRoute(this.path);
      }
    });
  }

  showPrompt() {
    return new Promise((resolve, reject) => {

      const prompt = this.alertCtrl.create({
        title: 'Title',
        message: "Enter a name for this new walk track",
        inputs: [
          {
            name: 'title',
            placeholder: 'Title'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject(data)
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              resolve(data.title);
              console.log('Saved clicked');
            }
          }
        ]
      });
      prompt.present();

    });
  }

  loadMap() {
    this.title = '';//reset title
    let mapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.geolocation.getCurrentPosition().then(pos => {
      let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      this.map.setCenter(latLng);
      this.map.setZoom(16);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  startTracking() {

    this.showPrompt().then((e) => {
      this.title = e;
      this.isTracking = true;
      this.trackedRoute = [];

      this.positionSubscription = this.geolocation.watchPosition()
        .pipe(
        filter((p: any) => p.coords !== undefined) //Filter Out Errors
        )
        .subscribe((data: any) => {
          setTimeout(() => {
            this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
            this.redrawPath(this.trackedRoute);
          }, 0);
        });
    });
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  loadHistoricRoutes() {
    this.storage.get('routes').then(data => {
      if (data) {
        this.previousTracks = data;
      }
    });
  }

  stopTracking() {
    let newRoute = { finished: new Date().getTime(), title: this.title, path: this.trackedRoute };
    this.previousTracks.push(newRoute);
    this.storage.set('routes', this.previousTracks);

    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    //this.currentMapTrack.setMap(null);
  }

  showHistoryRoute(route) {
    this.redrawPath(route);
  }

  gotoList() {
    this.navCtrl.push('WalkTrackingRoutesPage');
  }

  getDeviceLocation() {
    this.loadMap();
  }
}