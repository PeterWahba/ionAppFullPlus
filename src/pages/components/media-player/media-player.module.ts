import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaPlayerPage } from './media-player';

@NgModule({
  declarations: [
    MediaPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaPlayerPage),
  ],
})
export class MediaPlayerPageModule {}
