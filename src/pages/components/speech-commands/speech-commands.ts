import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController } from 'ionic-angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-speech-commands',
  templateUrl: 'speech-commands.html',
})
export class SpeechCommandsPage {
  sensibility: number = 4;
  doShowGnomo: boolean = false;
  recognized: string;
  doShowFeiry: boolean = false;
  matches: String[];
  isRecording = false;
  commandShowFeiry = 'show feiry dancing';
  commandHideFeiry = 'hide feiry dancing';

  commandShowElf = 'show elf walking';
  commandHideElf = 'hide elf walking';

  levenshteinStr: string;

  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef, 
    private toastCtrl: ToastController) { }

  isIos() {
    return this.plt.is('ios');
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }

  startListening() {
    this.levenshteinStr = '';
    this.recognized = '';

    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {

      this.shouldShowFeiry(matches);//watch for feiry command from the speech
      this.shouldShowElf(matches);//watch for gnomo command from the speech

      this.matches = matches;
      this.cd.detectChanges();
      this.isRecording = false;
    });
    this.isRecording = true;
  }

  shouldShowFeiry(matches){
    let show = this.analizeCommandFromMatches(matches, this.commandShowFeiry);
    let hide = this.analizeCommandFromMatches(matches, this.commandHideFeiry);
    
    if(show.recognizedString){
      this.levenshteinStr = show.levenshtein;
      this.recognized = show.recognizedString;
      this.excecuteCommandFromMatches(show.command)
    }else if(hide.recognizedString){
      this.levenshteinStr = hide.levenshtein;
      this.recognized = hide.recognizedString;
      this.excecuteCommandFromMatches(hide.command)
    }
  }

  shouldShowElf(matches){
    let show = this.analizeCommandFromMatches(matches, this.commandShowElf);
    let hide = this.analizeCommandFromMatches(matches, this.commandHideElf);
    
    if(show.recognizedString){
      this.levenshteinStr = show.levenshtein;
      this.recognized = show.recognizedString;
      this.excecuteCommandFromMatches(show.command)
    }else if(hide.recognizedString){
      this.levenshteinStr = hide.levenshtein;
      this.recognized = hide.recognizedString;
      this.excecuteCommandFromMatches(hide.command)
    }
  }

  analizeCommandFromMatches(matches, command) {
    let recognizedString = '';
    let levenshtein = '';
    if (matches) {
      matches.forEach((e, i) => {
        e = e.toLowerCase();
        let lev  = this.levenshtein(e, command);
        if (lev < this.sensibility) {
          levenshtein = lev;
          recognizedString = e;
          return;
        }
      });
    }
    return {
      command: command,
      recognizedString: recognizedString,
      levenshtein: levenshtein
    }
  }

  excecuteCommandFromMatches(command){
    this.doShowFeiry = false;
    this.doShowGnomo = false;

    switch (command) {
      case this.commandShowFeiry:
        this.doShowFeiry = true;
        this.presentToast(this.commandShowFeiry + ' command was executed');
        break;

        case this.commandHideFeiry:
        this.doShowFeiry = false;
        this.presentToast(this.commandHideFeiry + ' command was executed');
        break;

        case this.commandShowElf:
        this.doShowGnomo = true;
        this.presentToast(this.commandShowElf + ' command was executed');
        break;

        case this.commandHideElf:
        this.doShowGnomo = false;
        this.presentToast(this.commandHideElf + ' command was executed');
        break;
    
      default:
        this.doShowFeiry = false;
        this.doShowGnomo = false;
        break;
    }
  }

  levenshtein(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
            Math.min(matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  };


  presentToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}