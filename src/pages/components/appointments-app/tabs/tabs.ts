import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';



@IonicPage()

@Component({
  templateUrl: 'tabs.html'
})
export class AppointmentAppTabsPage {

  tab1Root = 'AppointmentAppHomePage';
  tab2Root = 'AppntPage';
  tab3Root = 'ContactPage';
  tab4Root = 'AfterLoginPage';

  constructor(private nav: NavParams, private navCtrl: NavController, private platform: Platform ) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
        let r = this.nav.get('redirect');
        if (r == 'profile' && !!this.navCtrl.parent) {
          this.navCtrl.parent.select(3);
        }
    });
  }
}
