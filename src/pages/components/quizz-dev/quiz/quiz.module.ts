import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';
import { QuizzerComponentModule } from "../../../../components/quizzer/quizzer.module";

@NgModule({
  declarations: [
    QuizPage
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
    QuizzerComponentModule
  ],
  exports: [
    QuizPage
  ]
})
export class QuizPageModule {}
