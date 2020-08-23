import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, PopoverController, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { LeaderboardPage } from '../leaderboard/leaderboard';
import { Categories } from "../../../../providers/quizz/categories/categories";
import { Questions } from "../../../../providers/quizz/questions/questions";
import { Results } from "../../../../providers/quizz/results/results";

@IonicPage()
@Component({
    selector: 'page-quiz',
    templateUrl: 'quiz.html',
})
export class QuizPage {
    correctQuestions: any;
    books: any;
    currentuser: any;
    total: any;
    pts: number = 0;
    category: any;
    questions: any[];
    timed: boolean;
    inProgress: boolean;
    timer: any;
    score: any;
    params: any;
    numberOfQuestions: string;
    timedObj: any
    confirmedExit: boolean = false;
    public bannerSizeOpts = {};

    constructor(private nav: NavController, private navParams: NavParams, private CategoriesService: Categories, private QuestionsService: Questions,
        private ResultsService: Results,
        private Platform: Platform, private alertController: AlertController, private popoverCtrl: PopoverController) {

        this.params = navParams.data;
        this.timedObj = { 'true': 'timed test', 'false': 'practice' };
        let userFromStorage = window.localStorage.getItem('currentuser');
        if (userFromStorage) {
            this.currentuser = JSON.parse(userFromStorage);

        }
        this.init();
    }



    scoreChanged(score) {
        this.score = (score * 100 / this.questions.length).toFixed(2);
    }

    updateTimer(timer) {
        this.timer = timer;
    }

    onFinish(obj) {
        let that = this;
        this.inProgress = false;
        this.correctQuestions = obj.score;
        that.pts = this.getScore(obj.score);
        this.ResultsService.add(_.assign({
            date: new Date().getTime(),
            category: that.params.id,
            timed: that.params.timed,
            questions: that.questions.length,
            userName: that.currentuser.name,
            email: that.currentuser.email,
            pts: that.pts
        }, obj));
        window.localStorage.setItem(that.category.name, "true");

        if (this.score < 69 && this.category.books.length > 0) {
            //trying to sell a related book
            this.suggestedBook({});
        }

        //prevent popup exit confirmation from showing when finished a quiz
        this.confirmedExit = true;
    }

    getScore(correctAnswers) {
        let x = correctAnswers;
        let l = this.category.level;
        let m = this.category.membership;
        let c = !!window.localStorage.getItem(this.category.name) ? 2 : 3;
        let result = l * m * x * c;
        return result;
    }

    suggestedBook(myEvent) {
        if (!window.localStorage.getItem('dont-show-books-suggestions')) {
            let popover = this.popoverCtrl.create('suggestBookPopoverPage', {
                url: _.shuffle(this.category.books)[1]
            });

            popover.present({
                ev: myEvent
            });
        }
    }

    scoreColor() {
        return this.score > 69 ? '#acd372' : '#FF9800';
    } _

    tryAgain() {
        this.confirmedExit = true;
        this.init();
        this.load();
    }

    goToStats(id) {
        this.confirmedExit = true;
        this.nav.push('StatsPage', {
            id: id
        })
    }
    goToLeaders() {
        this.nav.push('LeaderboardPage');
    }

    newMatch() {
        this.confirmedExit = true;
        this.nav.setRoot('QuizzHomePage');
    }

    init() {
        this.questions = [];
        this.timed = this.params.timed;
        this.score = 0;
        this.inProgress = true;
        this.timer = '';
        this.category = {};
    }

    load() {
        this.CategoriesService.findById(this.params.id).subscribe((data) => {
            this.category = data;
            if (data)
                this.books = data.books;

        })

        this.QuestionsService.findByCategory(this.params.id).subscribe((res) => {
            this.total = res.length;

            let noq = 0
            if (this.params.numberOfQuestions != 'all') {
                noq = parseInt(this.params.numberOfQuestions);
            } else {
                noq = this.total;
            }

            this.questions = _.shuffle(res).slice(0, res.length < noq ? res.length : noq);
        })
    }

    ngOnInit() {
        this.load();
    }

    ionViewCanLeave() {
        if (!this.confirmedExit) {
            let confirm = this.alertController.create({
                title: 'Exit',
                message: 'Are you sure you want to exit the quiz? <br/> Your progress won\'t be stored ',
                buttons: [{
                    text: 'Exit',
                    handler: () => {
                        this.exitPage();
                        // confirm.dismiss().then(() => {
                        // });
                    }
                },
                {
                    text: 'Stay',
                    handler: () => {
                        // need to do something if the user stays?
                    }
                }]
            });
            confirm.present();

            // Return false to avoid the page to be popped up
            return false;
        }
    }

    public exitPage() {
        this.confirmedExit = true;
        this.nav.pop();
    }
}
