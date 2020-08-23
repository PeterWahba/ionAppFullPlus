import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from '../../../../providers/auth-data';

class Profile {
  constructor(
    public $key?: string,
    public email?: string,
    public name?: string,
    public phone?: string,
    public pic?: string,
    public aboutMe?: string,
    public pushTocken?: string
  ) { }

};

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class AfterLoginPage {
  isEditing: boolean;
  profile: Profile = new Profile;

  uid: any;

  constructor(private navCtrl: NavController, private authData: AuthData, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase, private navParams: NavParams) {

  }
  ionViewWillLoad() {

    this.afAuth.authState.subscribe(userAuth => {

      if (userAuth) {
        this.uid = userAuth.uid;

        this.afDb.object('/userProfile/' + this.uid).snapshotChanges()
          .map((c =>
            ({ $key: c.payload.key, ...c.payload.val() })
          ))
          .subscribe((profile: any) => {
            if (profile) {
              this.profile = new Profile();
              this.profile.$key = profile.$key;
              this.profile.email = profile.email;
              this.profile.name = profile.name;
              this.profile.phone = profile.phone;
              this.profile.pic = profile.pic;
              this.profile.aboutMe = profile.aboutMe;
              this.profile.pushTocken = profile.pushTocken;
            }
          });

      } else {
        console.log('auth false');
        this.navCtrl.setRoot('LoginPage');
      }

    });
  }

  logout() {
    this.authData.logoutUser()
      .then(authData => {
        console.log("Logged out");
        // toast message
        this.presentToast('bottom', 'You are now logged out');
        this.navCtrl.setRoot('LoginPage');
      }, error => {
        var errorMessage: string = error.message;
        console.log(errorMessage);
        //this.presentAlert(errorMessage);
      });
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }

  saveProfileInfo() {
    this.profile.name = this.profile.name || '';
    this.profile.phone = this.profile.phone || '';
    this.profile.aboutMe = this.profile.aboutMe || '';
    this.profile.pic = this.profile.pic || '';
    delete this.profile.$key;//avoid error when set
    this.afDb.database.ref('/userProfile/' + this.uid).set(this.profile).then((e) => {
      this.isEditing = false;
    });
  }

}
