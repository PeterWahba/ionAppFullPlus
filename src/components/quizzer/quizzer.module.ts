import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Quizzer } from './quizzer';

@NgModule({
  declarations: [
    Quizzer,
  ],
  imports: [
    IonicPageModule.forChild(Quizzer),
  ],
  exports: [
    Quizzer
  ]
})
export class QuizzerComponentModule {}
