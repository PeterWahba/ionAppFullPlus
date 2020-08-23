import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModePage } from './mode';

@NgModule({
  declarations: [
    ModePage,
  ],
  imports: [
    IonicPageModule.forChild(ModePage),
  ],
  exports: [
    ModePage,
  ]
})
export class ModePageModule {}
