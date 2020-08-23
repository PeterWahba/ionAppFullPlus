import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DialogflowChatPage } from './dialogflow-chat';

@NgModule({
  declarations: [
    DialogflowChatPage,
  ],
  imports: [
    IonicPageModule.forChild(DialogflowChatPage),
  ],
})
export class DialogflowChatPageModule {}
