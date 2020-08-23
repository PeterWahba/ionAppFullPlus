import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

import { SafeUrl } from '@angular/platform-browser';
import { Categories } from "../../../../providers/quizz/categories/categories";

@IonicPage()
@Component({
  selector: 'page-mode',
  templateUrl: 'mode.html',
})
export class ModePage {
  trustedUrl: (value: string) => SafeUrl;
  books: any;
  currentuser: any;
  description: string;
  params: any;
  category: any;
  numberOfQuestions: string = '20';


  constructor(private nav: NavController,
    private navParams: NavParams,
    private CategoriesService: Categories,
    private popoverCtrl: PopoverController) {
    this.params = this.navParams.data;
    let userFromStorage = window.localStorage.getItem('currentuser');
    if (userFromStorage) {
      this.currentuser = JSON.parse(userFromStorage);
     
    }

  }

  presentPopover(ev) {
    let that = this;
    let popover = this.popoverCtrl.create(QuizzPopoverPage, {
      numberOfQuestions: this.numberOfQuestions,
      updateNumberOfQuestions: (noq) => {
        that.numberOfQuestions = noq
      }
    });

    popover.present({
      ev: ev
    });
  }

  startQuiz(id, timed) {
    this.nav.push('QuizPage', {
      id: id,
      timed: timed,
      numberOfQuestions: this.numberOfQuestions
    })
  }

  goToStats(id) {
    this.nav.push('StatsPage', {
      id: id
    });
  }

  goToArchived(){
    this.nav.push('ArchivedPage');
  }

  ngOnInit() {
    this.CategoriesService.findById(this.params.id).subscribe((data) => {
      this.category = data;
      this.books = data.books;
        this.description = "You can select the amount of questions you would like to answer below";
    })
  }


}
//------------------------------------------------



@Component({
  template: `
    <ion-list class="mode-number-of-questions" radio-group [(ngModel)]="numberOfQuestions" (ionChange)="updateNumberOfQuestions(numberOfQuestions)">
       

        <ion-row>
          <ion-col col-6>
            <ion-item>
              <ion-label>5</ion-label>
              <ion-radio value="5"></ion-radio>
            </ion-item>
          </ion-col>
          <ion-col col-6>
            <ion-item>
              <ion-label>10</ion-label>
              <ion-radio value="10"></ion-radio>
            </ion-item>
          </ion-col>
          </ion-row>


        <ion-row>
          <ion-col col-6>
            <ion-item>
              <ion-label>20</ion-label>
              <ion-radio checked="true" value="20"></ion-radio>
            </ion-item>
          </ion-col>
          <ion-col col-6>
            <ion-item>
              <ion-label>30</ion-label>
              <ion-radio value="30"></ion-radio>
            </ion-item>
          </ion-col>
          </ion-row>


        <ion-row>
          <ion-col col-6>
            <ion-item>
              <ion-label>40</ion-label>
              <ion-radio value="40"></ion-radio>
            </ion-item>
          </ion-col>
          <ion-col col-6>
            <ion-item>
              <ion-label>All</ion-label>
              <ion-radio value="all"></ion-radio>
            </ion-item>
          </ion-col>
        </ion-row>

      <ion-row>
        <ion-col>
          <button (click)="close()" ion-item detail-none text-center >Close</button>
        </ion-col>
        </ion-row>

      </ion-list>

  `
})
export class QuizzPopoverPage {
  updateNumberOfQuestions: any;
  numberOfQuestions: string;


  constructor(private navParams: NavParams, private viewCtrl: ViewController) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.numberOfQuestions = this.navParams.data.numberOfQuestions;
      this.updateNumberOfQuestions = this.navParams.data.updateNumberOfQuestions;
    }
  }

}




