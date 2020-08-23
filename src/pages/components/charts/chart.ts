import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
    name: any;
  
    chartData: number[] =  [];

    chartLabels: string[] = [];
    chartLegend:boolean = false;

    //*********** chart color theme   **************//
    chartColor1: any[] = [{ backgroundColor: ['#d53e4f', '#f46d43', '#fdae61', '#e6f598', '#abdda4','#004602','#3288bd','#5e4fa2']}]; 
    
    chartColor2: any[] = [{backgroundColor:['rgba(127,0,0, 0.2)','rgba(215,48,39,0.2)','rgba(244,109,67,0.2)','rgba(253,174,97,0.2)','rgba(254,224,139,0.2)','rgba(255,255,191,0.2)','rgba(217,239,139,0.2)','rgba(166,217,106,0.2)','rgba(102,189,99,0.2)','rgba(26,152,80,0.2)','rgba(0,104,55,0.2)']}]; 
    
    chartColor3: any[] =  [{backgroundColor:['rgba(127,0,0, 0.8)','rgba(179,0,0, 0.7)','rgba(215,48,31, 0.4)','rgba(239,101,72, 0.4)','rgba(252,141,89, 0.4)','rgba(253,187,132, 0.4)']}]; 
    
    chartColor4: any[] = [{backgroundColor:['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a','#01665e','#003c30']}];
    
    chartColor5: any[] =  [{ backgroundColor:['#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e','#003c30']}]; 
    
   // chartColorForLine: any[] = [{ backgroundColor: ['#d53e4f', '#f46d43', '#fdae61', '#e6f598']}]; 
    //**********************************************//

    lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        legend: {position: 'bottom'}
    };
    halfDonutOption: any = {
            responsive: true,
            maintainAspectRatio: false,
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
    };


    chartView: string = "Bar";
    isDataAvailable: boolean = false;  

    //hardcoded line chart
    public lineChartData: Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


    constructor(public loadingCtrl: LoadingController,
        public db: DatabaseProvider, public navParams: NavParams) {
        this.chartView = this.navParams.get('type');
        this.name = this.navParams.get('name');

        let that = this;
        db.getDocuments('chart', ['view', '>', 1])
            .then(function (e) {
                if (!!e) {
                    e.forEach(snapshot => {
                        that.chartLabels.push(snapshot.country);
                        that.chartData.push(parseInt(snapshot.view));
                    });
                    that.isDataAvailable = true;
                }
                loadingPopup.dismiss()
        });



    let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
    });
    loadingPopup.present(); 

    } 
}