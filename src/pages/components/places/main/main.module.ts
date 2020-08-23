import { NgModule } from '@angular/core';
import { CityCategoryPage } from './main';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
      CityCategoryPage,
    ],
  imports: [
      IonicPageModule.forChild(CityCategoryPage)
  ],
  exports: [
      CityCategoryPage,
  ]
})
export class CityCategoryPageModule {}
