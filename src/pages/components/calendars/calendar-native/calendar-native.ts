import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';

import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-calendar-native',
  templateUrl: 'calendar-native.html',
})
export class CalendarNativePage {
  calendars = [];

  constructor(public navCtrl: NavController, private calendar: Calendar, private plt: Platform) {
    this.plt.ready().then(() => {
      this.calendar.listCalendars().then(data => {
        this.calendars = data;
      });
    })
  }

  addEvent(cal) {
    let date = new Date();
    let options = { calendarId: cal.id, calendarName: cal.name, url: 'https://jomendez.com', firstReminderMinutes: 15 };

    this.calendar.createEventInteractivelyWithOptions('My new Event', 'Miami', 'Special Notes', date, date, options).then(res => {
    }, err => {
      console.log('err: ', err);
    });
  }

  openCal(cal) {
    this.navCtrl.push('CalendarNativeDetailsPage', { name: cal.name })
  }
}