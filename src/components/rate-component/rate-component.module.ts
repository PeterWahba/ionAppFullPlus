import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RateComponent } from './rate-component';

@NgModule({
  declarations: [
    RateComponent,
  ],
  imports: [
    IonicPageModule.forChild(RateComponent),
  ],
  exports: [RateComponent]
})
export class RateComponentModule {}
