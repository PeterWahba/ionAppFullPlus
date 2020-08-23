import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//*********** ionic Native **************/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { AdMobFree } from '@ionic-native/admob-free';

import { MyApp } from './app.component';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { Calendar } from '@ionic-native/calendar';
import { HttpModule } from '@angular/http';

//***********  Angularfire2 v4 **************/

import { AngularFireModule } from 'angularfire2';
// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

//*********** Provider **************/
import { AuthData } from '../providers/auth-data';
import { AuthService } from '../providers/auth-pwa/auth.service';
import { AdmobProvider } from '../providers/admob/admob';
import { config, wordPressUrl } from '../config/config';


//*********** Image Gallery **************/
import { GalleryModal } from 'ionic-gallery-modal';
import { ZoomableImage } from 'ionic-gallery-modal';


//*********** Image Gallery **************/
import { SocialSharing } from '@ionic-native/social-sharing';


//*********** App Rate **************/
import { RateServiceProvider } from '../providers/rate-service/rate-service';
import { AppRate } from '@ionic-native/app-rate';
import { DatabaseProvider } from '../providers/database/database';


import { AndroidPermissions } from '@ionic-native/android-permissions';
import { PayPal } from '@ionic-native/paypal';
import { Push } from '@ionic-native/push';

import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Camera } from '@ionic-native/camera';

import { Stripe } from '@ionic-native/stripe';


import { Contacts } from '@ionic-native/contacts';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Hotspot } from '@ionic-native/hotspot';
import { SqliteDatabaseProvider } from '../providers/database-sqlite/database';

import { IonicStorageModule } from '@ionic/storage';

import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';
import { TextProcessorProvider } from '../providers/text-processor/text-processor';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { ThemeManagerProvider } from '../providers/theme-manager/theme-manager';
import {FirebaseStorageProvider } from '../providers/firebase-storage/firebase-storage';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { RssFeedProvider } from '../providers/rss-feed/rss-feed';

import { Http } from '@angular/http';
import { WordpressProvider } from '../providers/wordpress/wordpress';
import { WpApiModule, WpApiLoader, WpApiStaticLoader} from 'wp-api-angular';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { FirestoreStorageProvider } from '../providers/firestore-storage/firestore-storage';

import { AngularCropperjsModule } from 'angular-cropperjs';
import { Instagram } from '@ionic-native/instagram';

import 'web-photo-filter';
import { MediaCapture } from '@ionic-native/media-capture';
import { Media } from '@ionic-native/media';

import { StreamingMedia } from '@ionic-native/streaming-media';

import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { RateComponentModule } from "../components/rate-component/rate-component.module";
import { YoutubeProvider } from '../providers/youtube/youtube';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { NgCalendarModule  } from 'ionic2-calendar';
import { GoogleCloudVisionProvider } from '../providers/google-cloud-vision/google-cloud-vision';
import { Results } from "../providers/quizz/results/results";
import { Categories } from "../providers/quizz/categories/categories";
import { Questions } from "../providers/quizz/questions/questions";
import { userProvider } from "../providers/quizz/user/userProvider";
import { PipesModule } from "../pipes/pipes.module";
import { QuizzPopoverPage } from "../pages/components/quizz-dev/mode/mode";



export function WpApiLoaderFactory(http) {
  return new WpApiStaticLoader(http, wordPressUrl);
}


@NgModule({
  declarations: [
    MyApp,
    QuizzPopoverPage,
    GalleryModal,
    ZoomableImage,
  ],
  imports: [
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [Http],
      AngularCropperjsModule,
    }),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RateComponentModule,
    AngularFireStorageModule,
    NgCalendarModule,
    PipesModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    QuizzPopoverPage,
    GalleryModal,
    ZoomableImage,
  ],
  providers: [
    Results,
    Categories,
    Questions,
    userProvider,
    YoutubeVideoPlayer,
    TextToSpeech,
    SpeechRecognition,
    StreamingMedia,
    Media,
    MediaCapture,
    Instagram,
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthData,
    AuthService,
    Network,
    GooglePlus,
    Facebook,
    AdmobProvider,
    AdMobFree,
    SocialSharing,
    RateServiceProvider,
    AppRate,
    CallNumber,
    SMS,
    Calendar,
    DatabaseProvider,
    AndroidPermissions,
    PayPal,
    Stripe,
    Push,
    Clipboard,
    Toast,
    Camera,
    Contacts,
    LaunchNavigator,
    Hotspot,
    SQLitePorter,
    SQLite,
    TextProcessorProvider,
    SqliteDatabaseProvider,
    FileTransfer,
    File,
    Transfer,
    FilePath,
    FileOpener,
    ThemeManagerProvider,
    FirebaseStorageProvider,
    InAppBrowser,
    RssFeedProvider,
    WordpressProvider,
    FirestoreStorageProvider,
    YoutubeProvider,
    GoogleCloudVisionProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
