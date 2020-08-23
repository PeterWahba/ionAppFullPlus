import { NgModule } from '@angular/core';
import { RestaurantCategoryPage } from './main';
import { IonicPageModule } from 'ionic-angular';
import { RateComponentModule } from "../../../../components/rate-component/rate-component.module";

@NgModule({
  declarations: [
      RestaurantCategoryPage
  ],
  imports: [
      IonicPageModule.forChild(RestaurantCategoryPage),
      RateComponentModule
  ],
  exports: [
      RestaurantCategoryPage
  ]
})
export class RestaurantCategoryPageModule {}
