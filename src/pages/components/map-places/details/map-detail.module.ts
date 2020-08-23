import { NgModule } from '@angular/core';
import { MapDetailPage } from './map-detail';
import { IonicPageModule } from 'ionic-angular';
import { ExposeSlideItemDirective } from '../../../../directives/expose-slide-item/expose-slide-item';
// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
      MapDetailPage,
      ExposeSlideItemDirective
  ],
  imports: [
      IonicPageModule.forChild(MapDetailPage),
      Ionic2RatingModule // Put ionic2-rating module here
  ],
  exports: [
    MapDetailPage
  ]
})
export class MapDetailPageModule {}
