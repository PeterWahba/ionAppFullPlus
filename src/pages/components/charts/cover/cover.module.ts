import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoverChartPage } from './cover';

@NgModule({
  declarations: [
      CoverChartPage,
  ],
  imports: [
      IonicPageModule.forChild(CoverChartPage),
  ],
  exports: [
      CoverChartPage
  ]
})
export class CoverChartPageModule {}
