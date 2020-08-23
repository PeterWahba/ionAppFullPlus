import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarNativeDetailsPage } from './calendar-native-details';

@NgModule({
  declarations: [
    CalendarNativeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarNativeDetailsPage),
  ],
})
export class CalendarNativeDetailsPageModule {}
