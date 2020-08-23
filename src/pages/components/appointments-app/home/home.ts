import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from '../../../../providers/auth-pwa/auth.service';
import { config, imagesSlideAppt } from "../../../../config/config";

declare var $;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class AppointmentAppHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, private nav: NavController, private platform: Platform) {
  }

  ionViewDidLoad() {
    let imgs = imagesSlideAppt;
    this.platform.ready().then(() => {
      $('.v-slide').vegas({
        delay: 5000,
        shuffle: true,
        slides: imgs,
        //transition: [ 'zoomOut', 'burn' ],
        animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
      });
    });
    this.installInit();
  }

  logout(){
    this.auth.signOut().then(()=>{
      this.nav.setRoot('LoginPage');
    })
  }

  setAppointment(){
    this.navCtrl.parent.select(1);
  }

  getDirections(){
    this.navCtrl.parent.select(2);
  }

  Installer(root) {
    let promptEvent;
    
    const install = function(e) {
      if(promptEvent) {
        promptEvent.prompt();
        promptEvent.userChoice
          .then(function(choiceResult) {
            // The user actioned the prompt (good or bad).
            // good is handled in 
            promptEvent = null;
            root.classList.remove('available');
          })
          .catch(function(installError) {
            // Boo. update the UI.
            promptEvent = null;
            root.classList.remove('available');
          });
      }
    };
  
    const installed = function(e) {
      promptEvent = null;
      // This fires after onbeforinstallprompt OR after manual add to homescreen.
      root.classList.remove('available');
    };
  
    const beforeinstallprompt = function(e) {
      promptEvent = e;
      promptEvent.preventDefault();
      root.classList.add('available');
      return false;
    };
  
    window.addEventListener('beforeinstallprompt', beforeinstallprompt);
    window.addEventListener('appinstalled', installed);
  
    root.addEventListener('click', install.bind(this));
    root.addEventListener('touchend', install.bind(this));
  };
  
  installInit(){
    let that = this;
    this.platform.ready().then(() => {
      window.addEventListener('load', function() {
        const installEl = document.getElementById('installer');
        const installer = new that.Installer(installEl);
      });
    });
   
  }

}
