import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage({ name: "RestaurantPopoverPage", segment: "restaurant-popover-page" })
@Component({
    template: `
    <ion-list>
      <button ion-item (click)="close(1)">Menu</button>
      <button ion-item (click)="close(2)">Promotions</button>
      <button ion-item (click)="close(3)">About</button>
    </ion-list>
  `
})
export class RestaurantPopoverPage {
    constructor(public viewCtrl: ViewController) { }

    close(index) {
        this.viewCtrl.dismiss(index);
    }
}