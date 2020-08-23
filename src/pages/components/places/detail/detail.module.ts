import { NgModule } from '@angular/core';
import { CityDetailPage } from './detail';
import { IonicPageModule } from 'ionic-angular';
// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
      CityDetailPage,
  ],
  imports: [
      IonicPageModule.forChild(CityDetailPage),
    Ionic2RatingModule // Put ionic2-rating module here
  ],
  exports: [
      CityDetailPage
  ]
})
export class CityDetailPageModule {}
