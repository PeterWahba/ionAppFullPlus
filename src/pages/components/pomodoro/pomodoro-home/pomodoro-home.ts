import { Component } from '@angular/core';
import { IonicPage } from "ionic-angular";

export interface PTimer {
  time: number;
  timeRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}

enum TimerType {
  Pomodoro,
  Break
}


@IonicPage()
@Component({
  selector: 'page-pomodoro-home',
  templateUrl: 'pomodoro-home.html',
})
export class PomodoroHomePage {
  title: string = 'Pomodoro';
  timerFactor: number = 4;
  background: string = '#f44336';
  pomodoro = 1500;
  timebreak = 300;

  private timeInSeconds: number;
  public timer: PTimer;
  progress: number = 100;
  timerType: TimerType = TimerType.Pomodoro;

  constructor() {
    this.initTimer();
  }

  ngOnInit() {
  }

  setMode() {
    if (this.timerType == TimerType.Pomodoro) {
      this.timeInSeconds = this.pomodoro;
      this.timerFactor = 4;
      this.timerType = TimerType.Break;
      this.background = '#f44336';
      this.title= 'Pomodoro';
    } else {
      this.timeInSeconds = this.timebreak;
      this.timerType = TimerType.Pomodoro;
      this.timerFactor = 20;
      this.background = 'green';
      this.title = 'Break';
    }
    this.initTimer();

  }

  initTimer() {
    if (!this.timeInSeconds) { 
      this.timeInSeconds = this.pomodoro;
    }

    this.timer = <PTimer>{
      time: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      timeRemaining: this.timeInSeconds
    };
    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timeRemaining);
  }

  startTimer(reasume = false) {
    if(!reasume){
      this.setMode();
    }
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  hasFinished() {
    return this.timer.hasFinished;
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer(true);//true parameter for reasume 
  }

  timerTick() {
    setTimeout(() => {

      if (!this.timer.runTimer) { return; }
      this.timer.timeRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timeRemaining);
      if (this.timer.timeRemaining > 0) {
        this.timerTick();
      }
      else {
        this.timer.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();

      this.progress = this.timerFactor * Number(minutesString + '.' + secondsString);
    

    return hoursString + ':' + minutesString + ':' + secondsString;
  }

}
