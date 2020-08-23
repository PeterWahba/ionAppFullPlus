import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PomodoroHomePage } from './pomodoro-home';
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
  declarations: [
    PomodoroHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PomodoroHomePage),
    ProgressBarModule
  ],
})
export class PomodoroHomePageModule {}
