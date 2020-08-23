import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WordpressHomePage } from './wordpress-home';

@NgModule({
  declarations: [
    WordpressHomePage,
  ],
  imports: [
    IonicPageModule.forChild(WordpressHomePage),
  ],
})
export class WordpressHomePageModule {}
