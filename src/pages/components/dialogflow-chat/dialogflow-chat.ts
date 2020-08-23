import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, Content, AlertController } from 'ionic-angular';

import { TextToSpeech } from "@ionic-native/text-to-speech";
import { DatabaseProvider } from "../../../providers/database/database";

declare var window;

@IonicPage()
@Component({
  selector: 'page-dialogflow-chat',
  templateUrl: 'dialogflow-chat.html',
})
export class DialogflowChatPage {

  messages: any[] = [];
  text: string = "";
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public ngZone: NgZone, public tts: TextToSpeech, private alertCtrl: AlertController, private db: DatabaseProvider) {

    this.messages.push({
      text: "Hi, welcome to ionAppFullPlus, how can I help you?",
      sender: "api"
    });
    this.messages.push({
      text: "You can say commands like \"take me to the lunch menu\" or \"open the cart\" or \"make me a sandwich\"",
      sender: "api"
    });

  }

  isNotDevice() {
    if (!(<any>window).cordova) {
      let confirmAlert = this.alertCtrl.create({
        title: "Attention",
        subTitle: 'You are running your code on a desktop browser, to be able to use this feature you need to run it on a device or emulator',
        buttons: ['OK']
      });
      confirmAlert.present();
      return true;
    }

    return false;
  }

  sendText() {
    if (!this.text || this.isNotDevice()) {
      return;
    }

    let message = this.text;

    this.messages.push({
      text: message,
      sender: 'me'
    });
    this.content.scrollToBottom(300);

    this.text = "";

    window["ApiAIPlugin"].requestText({
      query: message
    }, (response) => {

      this.ngZone.run(() => {
        console.log(response);
        let text = this.processCommand(response.result.fulfillment.speech);
        this.messages.push({
          text: text,
          sender: "api"
        });
        this.content.scrollToBottom(400);
      });
    }, (error) => {
      alert(JSON.stringify(error))
    })

  }

  sendVoice() {
    window["ApiAIPlugin"].requestVoice({},
      (response) => {
        let text = this.processCommand(response.result.fulfillment.speech);
        this.ngZone.run(() => {
          this.messages.push({
            text: text,
            sender: "api"
          });
          this.content.scrollToBottom(300);
        });

        this.tts.speak({
          text: text,
          locale: "en-US",
          rate: 1
        });
      }, (error) => {
        alert(error)
      });
  }


  processCommand(input) {
    console.log(input);
    if (input && input.indexOf(':::')) {
      let arr = input.split(':::');

      if(arr[0].indexOf('::') == -1 || arr[1].indexOf('::') == -1){
        return input;
      }
      let command = arr[0].split('::')[1];
      let text = arr[1].split('::')[1];

      switch (command) {
        case 'lunch':
          this.db.getDocuments('restaurant', ['id', '==', 'lunch']).then((e) => {
            console.log(e);
            if (e && e[0]) {
              setTimeout(() => {
                this.navCtrl.push('RestaurantListPage', { categoryId: e[0].$key, name: 'Lunch' });
              }, 3000);
            }
          });
          break;
          case 'dessert':
          this.db.getDocuments('restaurant', ['id', '==', 'dessert']).then((e) => {
            console.log(e);
            if (e && e[0]) {
              setTimeout(() => {
                this.navCtrl.push('RestaurantListPage', { categoryId: e[0].$key, name: 'Dessert' });
              }, 3000);
            }
          });
          break;
          case 'dinning' || 'dinner':
          this.db.getDocuments('restaurant', ['id', '==', 'dinning']).then((e) => {
            console.log(e);
            if (e && e[0]) {
              setTimeout(() => {
                this.navCtrl.push('RestaurantListPage', { categoryId: e[0].$key, name: 'Dinning' });
              }, 3000);
            }
          });
          break;
          case 'cofee':
          this.db.getDocuments('restaurant', ['id', '==', 'coffee']).then((e) => {
            console.log(e);
            if (e && e[0]) {
              setTimeout(() => {
                this.navCtrl.push('RestaurantListPage', { categoryId: e[0].$key, name: 'Coffee' });
              }, 3000);
            }
          });
          break;
          case 'cart':
              setTimeout(() => {
                this.navCtrl.push('CartPage');
              }, 3000);
          break;
          default:
          text = 'Command not recognized';

      }

      return text;
    } else {
      return input;
    }

  }

}