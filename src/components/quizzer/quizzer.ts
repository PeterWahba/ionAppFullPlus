import { Component, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import Prism from 'prismjs';
import Beautify from "js-beautify";

@Component({
  selector: 'quizzer',
  inputs: [
    'questions',
    'timed',
    'language'
  ],
  outputs: [
    'onScoreChanges',
    'onTimerChanges',
    'onFinish'
  ],
  templateUrl: 'quizzer.html'

})
export class Quizzer {
  code: any;
  public correctAns: boolean;

  public onScoreChanges: EventEmitter<any>;
  public onTimerChanges: EventEmitter<any>;
  public onFinish: EventEmitter<any>;

  public ans: number;
  public score: number;
  public index: number;
  public timer: number;
  public changedTimer: number;
  public quizOver: boolean;
  public inProgress: boolean;

  public questions: any[];
  public language: string;
  public title: string;
  public options: any[];
  public answer: number;
  public image: string;
  public answerMode: any;
  public timed: boolean;

  constructor() {
    this.onScoreChanges = new EventEmitter();
    this.onTimerChanges = new EventEmitter();
    this.onFinish = new EventEmitter();


    this.score = 0;
    this.index = 0;
    this.timer = 0;
    this.changedTimer;
    this.quizOver = false;
    this.inProgress = true;
  }
  resetVars() {
    this.ans = undefined;
    this.answer = null;
    this.code = "";
  }

  getQuestion() {
    this.resetVars();
    let q = this.questions[this.index];
    if (q) {
      let ans = q.options[q.answer];
      this.title = q.title;
      this.options = _.shuffle(q.options);
      this.answer = this.options.indexOf(ans);
      //this.image = q.image;

      if (!!q.code) {
        //extend the language to c#
        Prism.languages.csharp = Prism.languages.extend('clike', {
          'keyword': /\b(abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|get|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|while)\b/g,
          'string': /@?("|')(\\?.)*?\1/g,
          'number': /\b-?(0x)?\d*\.?\d+\b/g
        });

        if (!!this.language && this.language.toLowerCase() == "html") {
          let code = Beautify.html_beautify(q.code);
          this.code = Prism.highlight(code, Prism.languages.html);
        } else if (!!this.language && this.language.toLowerCase() == "css") {
          let code = Beautify.css_beautify(q.code);
          this.code = Prism.highlight(code, Prism.languages.css);
        } else {
          q.code = "/* Code example */" + q.code;
          //q.code = "int[] years = { 2013, 2014, 2015 };int[] population = { 1025632, 1105967, 1148203 };String s = String.Format(\"{0,-10} {1,-10}\n\n\", \"Year\", \"Population\");for(int index = 0; index < years.Length; index++)   s += String.Format(\"{0,-10} {1,-10:N0}\n\",                      years[index], population[index]);"

          //clear all /n before beautify it
          q.code = q.code.replace(new RegExp('\n', 'g'), '');
          let code = Beautify.js_beautify(q.code, {
            'indent_size': 1,
            'indent_char': ' '
          });
          this.code = Prism.highlight(code, Prism.languages.javascript);
          // this.code = code;
        }
      }

      this.answerMode = true;
    } else {
      this.quizOver = true;
      this.reset();
    }
    this.index++;
  }

  reset() {
    this.inProgress = false;

    let obj = {
      score: this.score,
      timer: 0
    };

    if (this.timed) obj.timer = this.changedTimer;

    if (this.index == this.questions.length) {
      this.onFinish.emit(obj);
    }
  }

  checkAnswer() {
    if (typeof this.ans === 'undefined') return;

    if (this.ans == this.answer) {
      this.timer = this.timer + 30;

      this.score++;
      this.correctAns = true;
      this.onScoreChanges.emit(this.score);
    } else {
      this.correctAns = false;
    }

    this.answerMode = false;
    setTimeout(() => {
      this.nextQuestion()
    }, 1500)
  }

  nextQuestion() {
    this.getQuestion();
  }

  ngAfterViewInit() {
    this.onScoreChanges.emit(this.score);
  }

  updateTimer(timerStr) {
    this.onTimerChanges.emit(timerStr);
  }

  onTick(timer) {
    this.changedTimer = timer;
  }

  onEnd() {
    this.reset();
  }

  isRight(option) {
    return !this.answerMode && option === this.options[this.answer];
  }

  isWrong(option) {
    return !this.answerMode && option === this.options[this.ans] && this.options[this.ans] !== this.options[this.answer];
  }

  ngOnChanges(changes) {
    let q = changes.questions.currentValue;
    if (q) {
      this.questions = q;
    }
  }

  ngOnInit() {
    this.nextQuestion();
    this.timer = 60;
  }
}
