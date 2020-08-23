import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RssFeedHomePage } from './rss-feed-home';

@NgModule({
  declarations: [
    RssFeedHomePage,
  ],
  imports: [
    IonicPageModule.forChild(RssFeedHomePage),
  ],
})
export class RssFeedHomePageModule {}
