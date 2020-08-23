import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflinePage } from './offline';
import { ShrinkHeaderModule } from '../../components/shrink-header/shrink-header.module';


@NgModule({
  declarations: [
    OfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflinePage),
    ShrinkHeaderModule
  ],
  exports: [
    OfflinePage
  ]
})
export class OfflinePageModule {}
