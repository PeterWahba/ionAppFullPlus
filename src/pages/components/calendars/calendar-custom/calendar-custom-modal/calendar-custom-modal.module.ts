import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarCustomModalPage } from './calendar-custom-modal';

@NgModule({
  declarations: [
    CalendarCustomModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarCustomModalPage),
  ],
})
export class CalendarCustomModalPageModule {}
