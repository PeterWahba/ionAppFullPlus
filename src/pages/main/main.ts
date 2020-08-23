import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import { config } from '../../config/config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase from 'firebase';

/**
 * Generated class for the MainPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
    searchTerm: any;
    filtered: any;
    intro: {
        icon: string;
        title: string;
        component: string;
    };
    menu: {
        title: string;
        myicon: string;
        iconLeft: string;
        icon: string;
        showDetails: boolean;
        items: {
            name: string;
            component: string;
        }[];
    }[];
    pages: {
        icon: string;
        title: string;
        component: string;
    }[];

    messaging:any
    currentMessage = new BehaviorSubject(null)

    constructor(private navCtrl: NavController, private push: Push, private afAuth: AngularFireAuth, private afDB: AngularFireDatabase, private platform: Platform,
        private alertCtrl: AlertController) {

        this.intro = { icon: 'ios-book', title: 'Intro', component: "IntroPage" };

        this.menu = [
            {
                title: 'Components and Features',
                myicon: '',
                iconLeft: 'md-filing',
                icon: 'ios-add-outline',
                showDetails: false,
                items: [
                    { name: 'Login', component: 'LoginPage' },
                    { name: 'Phone Signing', component: 'PhoneSigningPage' },
                    { name: 'Login PWA', component: 'LoginPwaPage' },
                    { name: 'Register', component: 'RegisterPage' },
                    { name: 'Recover Pass', component: 'RecoverPage' },
                    { name: 'Logged-in Profile', component: 'AfterLoginPage' },
                    { name: 'Admob', component: 'AdmobPage' },
                    { name: 'Charts', component: 'CoverChartPage' },
                    { name: 'Rate The App', component: 'RatePage' },
                    { name: 'Chat', component: 'ContactsPage' },

                    { name: 'QR Scan & Create', component: 'QrHomePage' },
                    { name: 'CSV Editor', component: 'CsvIntroMenuPage' },
                    { name: 'Dynamic Theme', component: 'DynamicThemePage' },
                    { name: 'Signature Pad', component: 'SignaturePadPage' },
                    { name: 'Rss Feed', component: 'RssFeedHomePage' },
                    { name: 'WordPress', component: 'WordpressHomePage' },
                    { name: 'Pomodoro Timer', component: 'PomodoroHomePage' },
                    { name: 'Media capture & play', component: 'MediaPlayerPage' },
                    { name: 'Media Streaming', component: 'MediaStreamingPage' },
                    { name: 'Speech Commands', component: 'SpeechCommandsPage' },
                    { name: 'BotChat', component: 'DialogflowChatPage' },
                    { name: 'Whiteboard', component: 'WhiteboardPage' },
                    { name: 'Youtube', component: 'YoutubePage' },
                    { name: 'Calendar Native', component: 'CalendarNativePage' },
                    { name: 'Calendar Custom', component: 'CalendarCustomPage' },
                    { name: 'Walk Tacking', component: 'WalkTackingPage' },
                    { name: 'Face Recognition', component: 'AzureFaceRecognitionPage' },
                    { name: 'Google Cloud Vision', component: 'GoogleCloudVisionPage' },
                    { name: 'Game 2048', component: 'Game2048Page' },
                    { name: 'Appointment App', component: 'AppointmentAppTabsPage' },
                    { name: 'Quizz dev App', component: 'QuizzHomePage' },
                    
                                                                                                                                            
                    
                    { name: 'Discover Places', component: 'CityCategoryPage' },
                    { name: 'e-commerce Shopping', component: 'ShoppingCategoryPage' },
                    { name: 'Restaurant Menu', component: 'RestaurantCategoryPage' },
                    { name: 'Cart', component: 'CartPage' },
                    { name: 'Places Map', component: 'MapPage' },
                    { name: 'Photo gallery', component: 'PhotosPage' },
                    { name: 'Social Feed Cards', component: 'FeedPage' },
                    { name: 'Example of CRUD', component: 'FormResultPage' },

                    { name: 'Profile Social', component: 'ProfileSocialPage' },
                    { name: 'Profile Corporate', component: 'ProfileCorporatePage' },
                    { name: 'Profile with Gallery', component: 'ProfileGalleryPage' },
                    { name: 'Profile with tabs', component: 'ProfileTabsPage' },

                    { name: 'Social Contacts', component: 'SearchPage' },
                    { name: 'Social Timeline', component: 'TimelinePage' },
                    { name: 'Notifications', component: 'NotificationsPage' },
                    { name: 'Weather', component: 'WeatherPage' }
                ]
            }
        ];

        this.pages = [
            { icon: 'md-aperture', title: 'Theme Color', component: "ThemePage" }
        ];

        this.platform.ready().then(() => {

            if ((<any>window).cordova) {
                this.setUpPushNotification();
            } else {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }
                this.messaging = firebase.messaging();

                this.getPermission();
                this.receiveMessage();
                this.currentMessage.subscribe((notification) => {
                    if (!notification || !notification.additionalData || !notification.additionalData.extras) {
                        return;
                    }
                    this.navCtrl.push('NotificationsPage', { title: notification.additionalData.extras.landingTitle, body: notification.additionalData.extras.landingText }); 
                });
            }
        });
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MainPage');
      this.setFilteredItems();
  }

  toggleDetails(menu) {
      if (menu.showDetails) {
          menu.showDetails = false;
          menu.icon = 'ios-add-outline';
      } else {
          menu.showDetails = true;
          menu.icon = 'ios-remove-outline';
      }
  }

  openPage(page) {
      this.navCtrl.push(page.component).catch(err => console.error(err));
  }

  setFilteredItems() {
      this.filtered = this.filterItems(this.menu[0].items, this.searchTerm);
  }

  filterItems(items, searchTerm) {
      if (!!searchTerm && searchTerm != '') {
          return items.filter((item) => {
              return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          });
      } else {
          return items;
      }
  }


  setUpPushNotification() {
      const options: PushOptions = {
          android: {
              senderID: config.messagingSenderId
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          },
          windows: {},
          browser: {
              pushServiceURL: 'http://push.api.phonegap.com/v1/push'
          }
      };

      const pushObject: PushObject = this.push.init(options);

      pushObject.on('notification').subscribe((notification: any) => {
          //alert('Received a notification ' + JSON.stringify(notification));
          if (!notification.additionalData || !notification.additionalData.extras) {
              return;
          }
          this.navCtrl.push('NotificationsPage', { title: notification.additionalData.extras.landingTitle, body: notification.additionalData.extras.landingText }); 
      });

      pushObject.on('registration').subscribe((registration) => {
          this.afAuth.authState.subscribe(userAuth => {
              if (!!userAuth) {
                  this.afDB.object('/userProfile/' + userAuth.uid).update({ pushTocken: registration.registrationId });
                  return;
              } else {
                  let prompt = this.alertCtrl.create({
                      title: 'Login',
                      message: "You need to login to receive push notification",

                      buttons: [
                          {
                              text: 'Login',
                              handler: data => {
                                  this.navCtrl.push('LoginPage');
                              }
                          }
                      ]
                  });
                  prompt.present();
              }
          });
          //alert('Device registered ' + JSON.stringify(registration));
      });

      pushObject.on('error').subscribe(error => {
          alert('Error with Push plugin ' + JSON.stringify(error))
      });
  }


//push notification for web/browser version

  updateToken(token) {

      this.afAuth.authState.subscribe(userAuth => {
          if (!!userAuth) {
              this.afDB.object('/userProfile/' + userAuth.uid).update({ pushTocken: token});
              return;
          } else {
              let prompt = this.alertCtrl.create({
                  title: 'Login',
                  message: "You need to login to receive push notification",

                  buttons: [
                      {
                          text: 'Login',
                          handler: data => {
                              this.navCtrl.push('LoginPage');
                          }
                      }
                  ]
              });
              prompt.present();
          }
      });
  }

  getPermission() {
      this.messaging.requestPermission()
          .then(() => {
              console.log('Notification permission granted.');
              return this.messaging.getToken()
          })
          .then(token => {
              console.log(token)
              this.updateToken(token)
          })
          .catch((err) => {
              console.log('Unable to get permission to notify.', err);
          });
  }

  receiveMessage() {
      this.messaging.onMessage((notification: any) => {
          console.log("Message received. ", notification);
          this.currentMessage.next(notification);
          if (!notification || !notification.data) {
              return;
          }
          let data = notification.data;
          data.extras = JSON.parse(data.extras);
          this.navCtrl.push('NotificationsPage', { title: data.extras.landingTitle, body: data.extras.landingText }); 

      });
  }
}
