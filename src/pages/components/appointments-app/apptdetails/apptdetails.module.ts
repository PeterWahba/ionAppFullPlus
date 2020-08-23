import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApptdetailsPage } from './apptdetails';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ApptdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ApptdetailsPage),
    Ionic2RatingModule,
  ],
})
export class ApptdetailsPageModule {}
