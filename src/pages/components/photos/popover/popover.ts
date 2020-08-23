import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage({ name: "PhotosPopoverPage", segment: "photos-popover-page" })
@Component({
    template: `
    <ion-list>
      <button ion-item (click)="close(1)">One column</button>
      <button ion-item (click)="close(2)">Two columns</button>
      <button ion-item (click)="close(3)">Three columns</button>
      <button ion-item (click)="close(4)">Four columns</button>
    </ion-list>
  `
})
export class PhotosPopoverPage {
    constructor(public viewCtrl: ViewController) { }

    close(index) {
        this.viewCtrl.dismiss(index);
    }
}