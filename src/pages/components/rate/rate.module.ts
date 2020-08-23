import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatePage } from './rate';
import { RateComponentModule } from "../../../components/rate-component/rate-component.module";

@NgModule({
  declarations: [
    RatePage
  ],
  imports: [
    IonicPageModule.forChild(RatePage),
    RateComponentModule
  ],
  exports: [
    RatePage
  ],
})
export class RatePageModule {}
