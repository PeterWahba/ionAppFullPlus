import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalkTackingPage } from './walk-tacking';

@NgModule({
  declarations: [
    WalkTackingPage,
  ],
  imports: [
    IonicPageModule.forChild(WalkTackingPage),
  ],
})
export class WalkTackingPageModule {}
