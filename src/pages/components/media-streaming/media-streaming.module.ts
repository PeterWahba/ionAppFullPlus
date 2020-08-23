import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaStreamingPage } from './media-streaming';

@NgModule({
  declarations: [
    MediaStreamingPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaStreamingPage),
  ],
})
export class MediaStreamingPageModule {}
