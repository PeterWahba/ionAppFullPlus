import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SuggestBookPopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  template: `
    <ion-row>
    <ion-col>
      <ion-row><ion-col text-center style="font-weight: bold;font-size: 2rem;">Improve yourself</ion-col></ion-row>
      <ion-row>
      <ion-col padding>
         
          <span>Based on you score, I think you can improve your habilities in this topic with this book. It helped me a lot.</span>      
      </ion-col>
      </ion-row>
      
      <ion-row>
         <ion-col text-center> <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" class="e2e-iframe-trusted-src" [src]="book | safe"></iframe></ion-col>
      </ion-row>

      <ion-row>
      <ion-col><button ion-button color="quizzbtndark" block (click)="close()">Not Now</button></ion-col>
      <ion-col><button ion-button color="quizzbtndark" block (click)="dontShowAgain()">Dont't show this againg</button></ion-col>
      </ion-row>
    </ion-col>
    </ion-row>
  `
})
export class suggestBookPopoverPage {
  book: any;
  constructor(private navParams: NavParams, private viewCtrl: ViewController) { }

  close() {
    this.viewCtrl.dismiss();
  }

  dontShowAgain() {
    window.localStorage.setItem('dont-show-books-suggestions', 'true');
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.book = this.navParams.data.url;
    }
  }
}



