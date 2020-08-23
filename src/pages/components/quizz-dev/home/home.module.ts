import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizzHomePage } from './home';

@NgModule({
  declarations: [
    QuizzHomePage,
  ],
  imports: [
    IonicPageModule.forChild(QuizzHomePage),
  ],
  exports: [
    QuizzHomePage
  ]
})
export class QuizzHomePageModule {}
