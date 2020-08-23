import { NgModule } from '@angular/core';
import { ShoppingCategoryPage } from './main';
import { IonicPageModule } from 'ionic-angular';
import { RateComponentModule } from "../../../../components/rate-component/rate-component.module";


@NgModule({
  declarations: [
      ShoppingCategoryPage
  ],
  imports: [
      IonicPageModule.forChild(ShoppingCategoryPage),
      RateComponentModule
    //ShrinkHeaderModule 
  ],
  exports: [
      ShoppingCategoryPage
  ]
})
export class ShoppingCategoryPageModule {}
