import { NgModule } from '@angular/core';
import { CityListMapPage } from './list-map';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      CityListMapPage,
  ],
  imports: [
      IonicPageModule.forChild(CityListMapPage),
  ],
  exports: [
      CityListMapPage
  ]
})
export class CityListMapPageModule {}
