import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-phone-signing',
  templateUrl: 'phone-signing.html',
})
export class PhoneSigningPage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  isSignin: boolean = false;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private afAuth: AngularFireAuth) { }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.isSignin = true;
      }else{
        this.isSignin = false;        
      }
    });
  }

  signIn(phoneNumber: number) {
    let that = this;
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+1" + phoneNumber; //please note the +1 code is the country code, +1 is USA
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult => {
        
        let prompt = this.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Send',
              handler: data => {
                confirmationResult.confirm(data.confirmationCode)
                  .then(function (result) {
                    // User signed in successfully.
                    that.isSignin = true;
                    console.log(result.user);

                  }).catch(function (error) {
                    that.isSignin = false;
                    alert(' User couldn\'t sign in');
                    console.log(error);
                  });
              }
            }
          ]
        });
        prompt.present();
      })
      .catch(function (error) {
        console.error("SMS not sent", error);
      });

  }

  gotoProfile() {
    this.navCtrl.push('AfterLoginPage');
  }

}