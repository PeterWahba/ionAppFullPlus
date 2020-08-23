import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

declare var GameManager;
declare var KeyboardInputManager;
declare var HTMLActuator;
declare var LocalStorageManager;

@IonicPage()
@Component({
  selector: 'page-game2048',
  templateUrl: 'game2048.html',
})
export class Game2048Page {

  @ViewChild('scoreContainer') score: ElementRef;
  @ViewChild('bestContainer') best: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      window.requestAnimationFrame(function () {
        new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
      });
      //get updates from the score on a callback function every time it changes
      this.transformHtmlElementIntoObservable(this.score.nativeElement, (e)=>{
        console.log(e.innerText);//note: this might be triggered multiples times 
      });
    });
  }

  transformHtmlElementIntoObservable(target, callback) {
      let observer = new MutationObserver(function (mutations) {
        mutations.forEach((mutation: any) => {
          if(typeof callback == 'function'){
            callback(target);
          }
          console.info("EVENT TRIGGERT " + mutation.target.id);
        });
      });

      // configuration of the observer:
      let config = { attributes: true, childList: true, characterData: true };

      // pass in the target node, as well as the observer options
      observer.observe(target, config);
  }

}
