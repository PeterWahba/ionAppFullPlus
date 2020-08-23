import { NgModule } from '@angular/core';
import { ShoppingListPage } from './list';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      ShoppingListPage,
  ],
  imports: [
      IonicPageModule.forChild(ShoppingListPage),
  ],
  exports: [
      ShoppingListPage
  ]
})
export class ShoppingListPageModule {}
