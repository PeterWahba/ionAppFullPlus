import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})




export class IntroPage {

  slides = [
    {
      title: "WELCOME",
      description: "ionAppFullPlus advanced showcases, integrations, and themes",
      image: "./assets/slide1.png",
      color: "#2b6a88"
    },
    {
        title: "Components and Features",
      description: "This template provides a large amount of components, showcases, integrations, and themes ready to be used with beautiful designs",
      image: "./assets/slide2.png",
      color: "#071f18"
    },
    {
      title: "Themes & Colors",
      description: "Ready, easy to use predefined colors, animations, etc",
      image: "./assets/slide4.png",
      color: "#0a0a02"
    }
  ];


  constructor(public navCtrl: NavController) {
  }

  openPage() {
      this.navCtrl.setRoot('MainPage'); 

  }
}
