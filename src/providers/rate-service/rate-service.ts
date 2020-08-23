import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppRate } from '@ionic-native/app-rate';
import { Platform } from 'ionic-angular';

/*
  Generated class for the RateServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RateServiceProvider {

    constructor(public platform: Platform, public appRate: AppRate) {
      this.platform.ready().then(
          () => this.appRate.preferences = {
              storeAppURL: {
                  ios: '<the apps Store ID>',//change this accordingly when deploy to IOS
                  android: 'market://details?id=com.evolutionsys.quiz',
                  windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>'
              },
              promptAgainForEachNewVersion: true,
             // usesUntilPrompt: 5,//pront after 5 uses
              callbacks: {
                  onButtonClicked: (buttonIndex) => {
                      console.log("onButtonClicked -> " + buttonIndex)
                      switch (buttonIndex) {
                          case 1:
                              console.log('Clicked on rate now');
                              break
                          case 2:
                              console.log('Clicked on remain me later');
                              break
                          case 3:
                              console.log('Clicked on No thanks');
                              break
                      }
                  },
                  onRateDialogShow: (callback) => {
                      console.log("onButtonClicked -> " + callback);
                  }
              }
          });
      //this.appRate.promptForRating(true);
  }

  public autoPromptForRating() {
      this.appRate.promptForRating(false);
  }

  public promptForRatingNow() {
      this.appRate.promptForRating(true);
  }


}
