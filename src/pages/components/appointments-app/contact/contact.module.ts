import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';

// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';
import { ShrinkHeaderModule } from "../../../../components/shrink-header/shrink-header.module";

@NgModule({
  declarations: [
    ContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactPage),
    Ionic2RatingModule,
    ShrinkHeaderModule
  ],
})
export class ContactPageModule {}
