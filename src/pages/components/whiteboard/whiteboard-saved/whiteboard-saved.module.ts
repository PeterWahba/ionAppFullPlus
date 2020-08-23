import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhiteboardSavedPage } from './whiteboard-saved';

@NgModule({
  declarations: [
    WhiteboardSavedPage,
  ],
  imports: [
    IonicPageModule.forChild(WhiteboardSavedPage),
  ],
})
export class WhiteboardSavedPageModule {}
