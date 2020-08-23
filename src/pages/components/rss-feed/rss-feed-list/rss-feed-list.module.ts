import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RssFeedListPage } from './rss-feed-list';

@NgModule({
  declarations: [
    RssFeedListPage,
  ],
  imports: [
    IonicPageModule.forChild(RssFeedListPage),
  ],
})
export class RssFeedListPageModule {}
