import { NgModule } from '@angular/core';
import { CityListPage } from './list';
import { IonicPageModule } from 'ionic-angular';
// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
      CityListPage,
  ],
  imports: [
      IonicPageModule.forChild(CityListPage),
    Ionic2RatingModule // Put ionic2-rating module here
  ],
  exports: [
      CityListPage
  ]
})
export class List1PageModule {}
