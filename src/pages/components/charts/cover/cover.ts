import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CoverChartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
    name: 'CoverChartPage',
    segment: 'cover-chart-reference'
})
@Component({
  selector: 'page-cover-chart',
  templateUrl: 'cover.html',
})
export class CoverChartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToChar(type) {
      switch (type) {
          case 'bar':
              this.navCtrl.push('ChartPage', { type: type, name:'Revenue' });
              break;
          case 'pie':
              this.navCtrl.push('ChartPage', { type: type, name: 'Market' });
              break;
          case 'line':
              this.navCtrl.push('ChartPage', { type: type, name: 'Trends' });
              break;
          case 'douhnut':
              this.navCtrl.push('ChartPage', { type: type, name: 'Dividends' });
              break;

      }
  }

  goToTransactions(){
    this.navCtrl.push('ChartTransactionsPage');
  }
}
