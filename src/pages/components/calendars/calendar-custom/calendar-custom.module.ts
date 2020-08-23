import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarCustomPage } from './calendar-custom';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [
    CalendarCustomPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarCustomPage),
    NgCalendarModule
  ],
})
export class CalendarCustomPageModule {}
