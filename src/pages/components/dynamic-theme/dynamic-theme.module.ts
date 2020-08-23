import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DynamicThemePage } from './dynamic-theme';

@NgModule({
  declarations: [
    DynamicThemePage,
  ],
  imports: [
    IonicPageModule.forChild(DynamicThemePage),
  ],
})
export class DynamicThemePageModule {}
