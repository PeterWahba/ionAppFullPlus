import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireAuth } from "angularfire2/auth";
import firebase from 'firebase';
import { webClientId } from '../../../config/config';

/**
 * Generated class for the NativeLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-native-login',
  templateUrl: 'native-login.html',
})
export class NativeLoginPage {
data: any;
dataFb: any;
constructor(public navCtrl: NavController, public navParams: NavParams, public googlePlus: GooglePlus, private fb: Facebook, public alertCtrl: AlertController, public afAuth: AngularFireAuth) {

  }

  loginWithFb(){
    let that = this;
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      alert('Logged-in succesfully with fp');
      that.dataFb = res;
      that.data = null;//remove g+ data


      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(res.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
          .then(response => {
              //alert("Firebase success: " + JSON.stringify(response));
              firebase.database().ref('/userProfile').child(response.uid).set({
                  email: response.email,
                  name: response.displayName,
                  pic: response.photoURL,
              });
          });


    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  loginWithGooglePlus(){
    let that = this;
    this.googlePlus.login({
        'webClientId': webClientId,
      'offline': true
    })
        .then(res => {
           //logged in
            alert("Logged-in succesfully with g+");
            that.data = res;
            that.dataFb = null; //remove fb data
            
            const googleCredential = firebase.auth.GoogleAuthProvider
                .credential(res.idToken);

            firebase.auth().signInWithCredential(googleCredential)
                .then(response => {
                    //alert("Firebase success: " + JSON.stringify(response));
                    firebase.database().ref('/userProfile').child(response.uid).set({
                        email: response.email,
                        name: response.displayName,
                        pic: response.photoURL,
                    });
                });
            
        })
        .catch(err => {
            alert("There is an error " + JSON.stringify(err));
        });
  }

  logout(){
    let that = this;
    this.googlePlus.logout().then(()=>{
      alert("Logged out");
      that.data = null;
    })
  }

  logoutFb(){
    let that = this;
    this.fb.logout().then(()=>{
      alert("Logged out");
      that.dataFb = null;
    })
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad NativeLoginPage');
      if (!(<any>window).cordova) {
          // running on desktop browser
          let alert = this.alertCtrl.create({
              title: 'Attention',
              subTitle: 'You are running your code on a desktop browser, to be able to use this feature you need to run it on a device or emulator',
              buttons: ['OK']
          });
          alert.present();
      }
  }

}
