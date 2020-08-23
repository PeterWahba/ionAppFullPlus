import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';


@IonicPage()
@Component({
  selector: 'page-media-streaming',
  templateUrl: 'media-streaming.html',
})
export class MediaStreamingPage {
  audios: string[];
  videos: string[];
  source: string = 'videos';

  constructor(public navCtrl: NavController, public navParams: NavParams, private streamingMedia: StreamingMedia, private plt: Platform) {
    this.videos = [
      'http://www.totalshortfilms.com/peliculas/12/319.mp4',
      'http://www.totalshortfilms.com/peliculas/12/430_hp.mp4',
      'http://www.totalshortfilms.com/peliculas/98/610_hp.mp4',
      'http://www.totalshortfilms.com/peliculas/98/609.mp4',
      'http://www.totalshortfilms.com/peliculas/6/166.mp4',
      'http://www.totalshortfilms.com/peliculas/6/167.mp4',
      'http://www.totalshortfilms.com/peliculas/4/276.mp4',
      'http://www.totalshortfilms.com/peliculas/4/116.mp4',
    ];

    this.audios = [
      'https://rss.art19.com/episodes/1379f2b7-f56a-4307-a479-befdf0b686e9.mp3',
      'https://traffic.megaphone.fm/GLT7300337708.mp3',
      'https://rss.art19.com/episodes/7eac64ef-2089-4c6a-a07c-efb6e0c1fd2d.mp3',
      'https://dts.podtrac.com/redirect.mp3/dovetail.prxu.org/119/db2b731f-2b6f-4d6c-b4d5-c3c6b07f1e25/Episode_3_Always_Tomorrow_Part_1.mp3',
      'http://soundbible.com/grab.php?id=2196&type=mp3',
    ]
  }


  startVideo(url) {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      orientation: 'portrait'
    };

    // http://www.sample-videos.com/
    this.streamingMedia.playVideo(url, options);

  }

  startAudio(url) {
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log('Finished Audio') },
      errorCallback: (e) => { console.log('Error: ', e) },
      initFullscreen: false // iOS only!
    };

    //http://soundbible.com/2196-Baby-Music-Box.html
    this.streamingMedia.playAudio(url, options);
  }

  stopAudio() {
    this.streamingMedia.stopAudio();
  }

  isIos() {
    return this.plt.is('ios');
  }
}
