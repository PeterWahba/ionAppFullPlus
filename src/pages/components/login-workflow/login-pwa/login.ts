import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, IonicPage, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../providers/auth-pwa/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { DatabaseProvider } from "../../../../providers/database/database";
import { imagesSlide } from "../../../../config/config";

declare var $;
@IonicPage({
    name: 'LoginPwaPage',
    segment: 'login-pwa'
})

@Component({
  selector: 'page-login-pwa',
  templateUrl: 'login.html'
})
export class LoginPwaPage {
  hideSocialButtons: boolean;
  public loginForm: any;
  data: any;
  dataFb: any;

    constructor(public navCtrl: NavController, public auth: AuthService, public fb: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
        public afAuth: AngularFireAuth, private db: DatabaseProvider, private platform: Platform) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }



  login() {
    let that = this;
    if (!this.loginForm.valid) {
      this.presentAlert('Username or password is incorrect')
      console.log("error");
    } else {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      this.auth.loginWithEmailAndPass(this.loginForm.value.email, this.loginForm.value.password)
        .then((credential:any) => {
          console.log("Auth pass");
          loadingPopup.dismiss();
          that.db.getDocumentsByName('users', credential.uid).then((u) => {
            if (!u || credential.uid != u.uid) {
              that.auth.signOut();
            } else {
                that.navCtrl.push('AfterLoginPage');
            }
          });
        }).catch((e) => {

          // .then(authData => {
          //   console.log("Auth pass");
          //   loadingPopup.dismiss();
          //   this.navCtrl.setRoot('AfterLoginPage', { data: authData });
          // }

          var errorMessage: string = e.message;
          loadingPopup.dismiss().then(() => {
            this.presentAlert(errorMessage)
          });
        });
    }
  }

  recover() {
    this.navCtrl.push('RecoverPage');
  }

  createAccount() {
    this.navCtrl.push('RegisterPage');
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }


  loginWithGooglePlus() {
      this.auth.registerUserWithGoogle(() => {
          this.navCtrl.push('AfterLoginPage');
      })
      .catch(err => {
        alert("There is an error " + JSON.stringify(err));
      });
  }

  logout() {
    this.auth.signOut();
  }


  ionViewDidLoad() {
    let imgs = imagesSlide;
      this.platform.ready().then(() => {
          if (!!$) {
              $('.v-slide').vegas({
                  delay: 5000,
                  shuffle: true,
                  slides: imgs,
                  //transition: [ 'zoomOut', 'burn' ],
                  animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
              });
          }
    });
  }
}

