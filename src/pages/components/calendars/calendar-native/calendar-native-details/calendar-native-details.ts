import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-calendar-native-details',
  templateUrl: 'calendar-native-details.html',
})
export class CalendarNativeDetailsPage {
  isIos: boolean;
  calName = '';
  events = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar, private plt: Platform) {
  }

  ionViewDidEnter() {
    this.calName = this.navParams.get('name');

    if (this.plt.is('ios')) {
      this.isIos = true;
      this.calendar.findAllEventsInNamedCalendar(this.calName).then(data => {
        this.events = data;
      });
    } else if (this.plt.is('android')) {
      this.isIos = false;
      let start = new Date();
      let end = new Date();
      end.setDate(end.getDate() + 31);

      this.calendar.listEventsInRange(start, end).then(data => {
        this.events = data;
        console.log(data);
      });
    }
  }

}