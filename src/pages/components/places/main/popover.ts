import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage({ name: "PopoverPage", segment: "popover-page" })
@Component({
    template: `
    <ion-list>
      <button ion-item (click)="close(1)">Rate the app</button>
      <button ion-item (click)="close(2)">About</button>
    </ion-list>
  `
})
export class PopoverPage {
    constructor(public viewCtrl: ViewController) { }

    close(index) {
        this.viewCtrl.dismiss(index);
    }
}