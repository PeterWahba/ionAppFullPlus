import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { YoutubeProvider } from "../../../../providers/youtube/youtube";

@IonicPage()
@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html',
})
export class PlaylistPage {
  title: any;
  videos: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ytProvider: YoutubeProvider, private youtube: YoutubeVideoPlayer
    , private plt: Platform) {
    let listId = this.navParams.get('id');
    this.title = this.navParams.get('title');
    this.videos = this.ytProvider.getListVideos(listId);
    this.videos.toPromise().then((e)=>{
      console.log(e);
    })
  }

  openVideo(video) {
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(video.snippet.resourceId.videoId);
    } else {
      window.open('https://www.youtube.com/watch?v=' + video.snippet.resourceId.videoId);
    }
  }

  getImgUrl(video){
    if(video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.default){
      return video.snippet.thumbnails.default.url;
    }else{
      return null;
    }
  }
}
