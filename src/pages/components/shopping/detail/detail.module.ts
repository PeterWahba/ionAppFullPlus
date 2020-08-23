import { NgModule } from '@angular/core';
import { ShoppingDetailPage } from './detail';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      ShoppingDetailPage,
  ],
  imports: [
      IonicPageModule.forChild(ShoppingDetailPage),
  ],
  exports: [
      ShoppingDetailPage
  ]
})
export class ShoppingDetailPageModule {}
