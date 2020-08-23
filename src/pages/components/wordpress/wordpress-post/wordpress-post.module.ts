import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WordpressPostPage } from './wordpress-post';

@NgModule({
  declarations: [
    WordpressPostPage,
  ],
  imports: [
    IonicPageModule.forChild(WordpressPostPage),
  ],
})
export class WordpressPostPageModule {}
