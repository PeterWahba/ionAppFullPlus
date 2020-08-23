import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'CALENDAR_EVENTS_LIST';

@IonicPage()
@Component({
  selector: 'page-calendar-custom',
  templateUrl: 'calendar-custom.html',
})
export class CalendarCustomPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage) { }

  ionViewDidEnter() {
    // Load all stored events
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          data.forEach(e => {
            e.startTime = new Date(e.startTime);
            e.endTime = new Date(e.endTime);
          });
          this.eventSource = data;
        }
      });
    });
  }

  addEvent() {
    let modal = this.modalCtrl.create('CalendarCustomModalPage', { selectedDay: this.selectedDay });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.storage.set(STORAGE_KEY, events)

        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  removeEvent(index) {
    this.eventSource.splice(index, 1);
    this.storage.set(STORAGE_KEY, this.eventSource);
    let events = JSON.parse(JSON.stringify(this.eventSource))
    this.eventSource = [];
    setTimeout(() => {
      events.forEach(e => {
        e.startTime = new Date(e.startTime);
        e.endTime = new Date(e.endTime);
      });
      this.eventSource = events;
    });
  }

}