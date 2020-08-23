import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhiteboardPage } from './whiteboard';

@NgModule({
  declarations: [
    WhiteboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WhiteboardPage),
  ],
})
export class WhiteboardPageModule {}
