import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Nav, Platform } from 'ionic-angular';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DatabaseProvider } from "../../../../providers/database/database";
import { GalleryModal } from 'ionic-gallery-modal';
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-apptdetails',
  templateUrl: 'apptdetails.html',
})
export class ApptdetailsPage {
  uid: any;
  loggedUser: any;
  showAll: boolean = false;
  //todayHours: { date: string; workHours: number[]; scheduledHours: number[]; };
  scheduledHours: any;
  hoursRange: any;
  workHours: number[];
  time: string;
  date: string;
  emp: any;
  when: string = 'today';
  private db: any;
  usersInfo: any = {};
  employeeIsLoggedUser: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fbdb: DatabaseProvider, public modalCtrl: ModalController, public alertCtrl: AlertController
    , private platform: Platform, private afAuth: AngularFireAuth) {
    // Initialise access to the firestore service
    this.db = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true };
    this.db.settings(settings);

    this.getDate();
    this.emp = this.navParams.get('emp');//pass the employee object as parameter to avoid db call


    //obtain the employee available hours from the employee object 
    if (!!this.emp && !!this.emp.availableHours) {

      //detect today day (sunday, monday, etc. )
      let d = new Date();
      let day = d.getDay();//0 = sunday, 1= moday, etc.
      let todayHours = this.emp.availableHours[day].hours;
      if (!todayHours) {
        todayHours = [];
      }

      this.hoursRange = todayHours.map((e) => {
        return {
          twentyFour: e,
          ampm: this.tConvert(e)
        }
      })
    } else {
      this.hoursRange = [];
    }

    this.getRealTimeApptUpdates();//watch for updates on the schedule
    this.getCurrentTime();//get current system time to show on the screen

  }

  refreshLoggedUser() {
    this.loggedUser = JSON.parse(localStorage.getItem('logged-user'));
    if(!this.loggedUser){
      this.afAuth.authState.subscribe(userAuth => {
        if (userAuth) {
            this.uid = userAuth.uid;
            this.db.object('/userProfile/' + this.uid).snapshotChanges()
                .map(c => ({ $key: c.payload.key, ...c.payload.val() }))
                .subscribe((profile: any) => {
                    var userFromStorage = window.localStorage.setItem('logged-user', JSON.stringify(profile));
                    this.loggedUser = profile;
                });
        }

    });
    }
  }

  tConvert(time) {//conver from 24 hours to 12 hours am/pm
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  getFirebaseDocumentFormattedTodayDate() { //e.g 3-12-2018
    let today = new Date();
    let d = today.getDate();
    let m = today.getMonth() + 1; //January is 0!
    let dd, mm;

    var yyyy = today.getFullYear();
    if (d < 10) {
      dd = '0' + d;
    } else {
      dd = d;
    }
    if (m < 10) {
      mm = '0' + m;
    } else {
      mm = m
    }
    return mm + '-' + dd + '-' + yyyy;
  }

  setAppointment(time) {
    this.refreshLoggedUser();
    if (!!this.loggedUser && !!this.loggedUser.phone) {
      //show popup asking for notes
      this.sendNotes((notes) => {
        this.scheduleHour(time, notes);
      });
    } else {
      this.presentAlert('Please edit your profile and provide your phone number, in case we need to reach you out to confirm your appointment');

      this.navCtrl.parent.select(3);
    }
  }


  scheduleHour(time, notes) {
    let apptsRef = this.db.collection('appts');
    let todayDate = this.getFirebaseDocumentFormattedTodayDate();
    let empIdUserId = this.emp.uid + '-' + this.loggedUser.uid;
    let timeEmpId = time + '-' + this.emp.uid;
    let emp = JSON.parse(JSON.stringify(this.emp));
    delete emp.availableHours;//to save space in the db

    notes = notes || '';
    let obj = {
      notes: notes,
      userInfo: this.loggedUser,
      empInfo: emp,
      userId: this.loggedUser.uid,
      empId: this.emp.uid,
      time: time,
      empIdUserId: empIdUserId,
      timeEmpId: timeEmpId
    };

    this.insertTodayDocInDb().then(() => {

      apptsRef.doc(todayDate).collection('data').where('empIdUserId', '==', empIdUserId).limit(1).get()
        .then((doc) => {
          if (!doc.empty && !this.employeeIsLoggedUser) {
            apptsRef.doc(todayDate).collection('data').doc(doc.docs[0].id).update(obj).then(e => {

            });
          } else {//if no doc or you are the employee and the logged user tring to set multiples appointment
            apptsRef.doc(todayDate).collection('data').add(obj).then(e => {

            });
          }
        });

    })

  }


  getRealTimeApptUpdates() {
    let apptsRef = this.db.collection('appts');
    let todayDate = this.getFirebaseDocumentFormattedTodayDate();
    let empId = this.emp.uid;
    apptsRef.doc(todayDate).collection('data').where('empId', '==', empId).onSnapshot((querySnapshot) => {
      let arr = []
      querySnapshot.forEach(doc => {
        let data = doc.data();
        data.$key = doc.id;
        arr.push(data);


      });

      if (!arr) {
        arr = [];
      }

      this.hoursRange.forEach(hour => {
        //reset all the properties
        hour.off = false;
        hour.isScheduled = false;
        hour.notes = null;
        hour.userPic = null;
        hour.name = null;
        hour.phone = null;
        hour.id = null

        var date = new Date();
        let t = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
        let currentTime = t.replace(':', '');
        let hTime = hour.twentyFour.replace(':', '');
        //currentTime = '11:00';//remove this
        if (hTime <= currentTime) {
          hour.off = true;
        }


        let scheduled = arr.filter((d) => {//filter function returns array
          d = d || {};
          return d.time == hour.twentyFour
        });
        if (!!scheduled && scheduled.length == 1) {
          hour.isScheduled = true;
          hour.notes = scheduled[0].notes;
          hour.userPic = !!scheduled[0].userInfo ? scheduled[0].userInfo.photoURL : '';
          hour.name = !!scheduled[0].userInfo ? scheduled[0].userInfo.displayName : '';
          hour.phone = !!scheduled[0].userInfo ? scheduled[0].userInfo.phone : '';
          hour.id = scheduled[0].$key
        }
      });
    });
  }


  insertTodayDocInDb() {
    return new Promise((resolve, reject) => {
      let apptsRef = this.db.collection('appts');
      let todayDate = this.getFirebaseDocumentFormattedTodayDate();

      apptsRef
        .doc(todayDate)
        .get().then((doc) => {
          if (!doc.exists) {
            apptsRef
              .doc(todayDate)
              .set({ check: true })
              .then((obj: any) => {
                resolve(true);
              })
              .catch((error: any) => {
                reject(error);
                console.log(error);
                alert(error);
              });
          } else {
            resolve(true);
          }
        })
    });
  }


  initLoggedUserSameCurrentEmpl() {
    //ask the user to enter quick notes (optional) that only employee can see
    let that = this;
    let k = this.loggedUser;
    if (this.emp.uid == k.uid) {
      that.employeeIsLoggedUser = true;
    } else {
      that.employeeIsLoggedUser = false;
    }
  }

  shouldShowNotes(o) {
    if (!!o.isScheduled && !!this.employeeIsLoggedUser) {//only show notes if Logged User is the employee
      return true;
    }
    return false;
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
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

  sendNotes(save) {
    let alertC = this.alertCtrl.create({
      title: 'Drop quick notes?',
      message: 'Would you like to leave a note? (optional)',
      inputs: [
        {
          name: 'notes',
          placeholder: 'Notes'
        }
      ],
      buttons: [
        {
          text: 'Skip',
          role: 'cancel',
          handler: data => {
            if (typeof save == 'function') {
              save('');
            }
          }
        },
        {
          text: 'Save',
          handler: data => {
            //Implement save feedback
            if (typeof save == 'function' && !!data && data.notes) {
              save(data.notes);
            } else {
              alert("If you click save you should enter a note, otherwise click on skip");
            }
          }
        }
      ]
    });
    alertC.present();
  }

  showNotes(notes) {
    let alert = this.alertCtrl.create({
      title: 'Notes',
      message: notes,
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: data => {

          }
        }
      ]
    });
    alert.present();
  }


  removeAppt(empUid, id) {
    if (!!id && !!this.employeeIsLoggedUser) {
      let apptsRef = this.db.collection('appts');
      let todayDate = this.getFirebaseDocumentFormattedTodayDate();
      apptsRef.doc(todayDate).collection('data').doc(id).delete().then((doc) => {

      });
    }
  }

  ionViewDidLoad() {
    this.refreshLoggedUser();
    this.initLoggedUserSameCurrentEmpl();//for the system to know if the logged user is same as current employee
  }

  getCurrentTime() {
    let that = this;
    this.getTime();
    Observable.interval(5000).subscribe(() => {
      that.getTime();
    });
  }

  getTime() {
    var time = new Date();
    this.time = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  }

  getDate() {
    var date = new Date();
    this.date = date.toLocaleString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' });
  }

  goToContact() {
    this.navCtrl.parent.select(2);
  }

}
