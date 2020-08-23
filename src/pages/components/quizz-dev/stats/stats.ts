import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import Chart from 'chart.js';
import leftpad from 'left-pad';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Results } from "../../../../providers/quizz/results/results";

@IonicPage()
@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html',
})
export class StatsPage {
    currentuser: any;
    totalPts: number;
    stds: string;
    practice: any[];
    timed: any[];
    results: any[];
    params: any;


    constructor(private navParams: NavParams, private resultsService: Results,) {
        this.stds = "practice";
        let that = this;

        this.params = navParams.data;

        this.results = [];
        this.timed = [];
        this.practice = [];

        Chart.defaults.global.responsive = true;
    }

    ngOnInit() {
        let that = this;
        var userFromStorage = window.localStorage.getItem('currentuser');
        this.currentuser = JSON.parse(userFromStorage);


        this.resultsService.getByCategory(this.params.id, this.currentuser.email).subscribe((data) => {
            let results = _.groupBy(data, 'timed');

            let mapResults = function (item) {
                let obj = {
                    date: moment(new Date(item.date)).format('lll'),
                    score: (item.score * 100 / item.questions).toFixed(2),
                    questions: item.questions,
                    correct: item.score,
                    pts: item.pts,
                    timer: null
                };
                if (!!item.timed) {
                    let duration = moment.duration(item.timer, 'seconds');
                    obj.timer = duration.minutes() + ':' + leftpad(duration.seconds(), 2, 0);
                }
                return _.assign({}, item, obj);
            }

            this.timed = _.reverse(_.map((results['true'] || []).slice(-15), mapResults));
            this.practice = _.reverse(_.map((results['false'] || []).slice(-15), mapResults));

            let datasets = [];
            if (this.practice.length) {
                datasets.push({
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    data: _.map(this.practice, 'score'),
                    label: 'Practice',
                    lineTension: 0.25
                })
            }

            if (this.timed.length) {
                datasets.push({
                    backgroundColor: 'rgba(255,205,86,0.4)',
                    borderColor: 'rgba(255,205,86,1)',
                    data: _.map(this.timed, 'score'),
                    label: 'Timed',
                    lineTension: 0.25
                })
            }
            let canvas: any = document.getElementById('statsChart');
            let ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth - 16;
            ctx.canvas.height = (window.innerWidth - 16) * 2 / 3;


            let myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: _.map(_.times(Math.max(this.timed.length, this.practice.length), Number), (item) => item + 1),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 100
                            }
                        }]
                    }
                }
            });
        })


        this.resultsService.getTotalPointsByCategory(this.params.id, this.currentuser.email).subscribe((data) => {
            if (data) {
                that.totalPts = data;
            }
        });
    }

}
