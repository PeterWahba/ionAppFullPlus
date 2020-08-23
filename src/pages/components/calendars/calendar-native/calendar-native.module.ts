import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarNativePage } from './calendar-native';

@NgModule({
  declarations: [
    CalendarNativePage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarNativePage),
  ],
})
export class CalendarNativePageModule {}
