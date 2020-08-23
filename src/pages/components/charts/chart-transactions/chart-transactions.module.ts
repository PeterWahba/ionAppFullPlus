import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartTransactionsPage } from './chart-transactions';

@NgModule({
  declarations: [
    ChartTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartTransactionsPage),
  ],
})
export class ChartTransactionsPageModule {}
