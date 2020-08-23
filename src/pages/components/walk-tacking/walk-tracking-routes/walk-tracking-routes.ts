import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-walk-tracking-routes',
  templateUrl: 'walk-tracking-routes.html',
})
export class WalkTrackingRoutesPage {

  previousTracks = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    this.loadHistoricRoutes();
  }

  showInMap(route) {
    this.navCtrl.push('WalkTackingPage', { route: route })
  }

  loadHistoricRoutes() {
    this.storage.get('routes').then(data => {
      if (data) {
        this.previousTracks = data;
      }
    });
  }

  deleteRoute(index) {
    this.previousTracks.splice(index, 1);
    this.storage.set('routes', this.previousTracks);
  }
}
