import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeechCommandsPage } from './speech-commands';

@NgModule({
  declarations: [
    SpeechCommandsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeechCommandsPage),
  ],
})
export class SpeechCommandsPageModule {}
