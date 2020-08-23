import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { YoutubeProvider } from "../../../providers/youtube/youtube";


@IonicPage()
@Component({
  selector: 'page-youtube',
  templateUrl: 'youtube.html',
})
export class YoutubePage {
  channelId = 'UChYheBnVeCfhCmqZfCUdJQw'; //ionic channel
  playlists: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ytProvider: YoutubeProvider, private alertCtrl: AlertController) {
  }

  ionViewDidEnter(){
    this.searchPlaylists();
  }

  searchPlaylists() {
    this.playlists = this.ytProvider.getPlaylistsForChannel(this.channelId);
    this.playlists.subscribe(data => {
      console.log('playlists: ', data);
    }, err => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'No Playlists found for that Channel ID',
        buttons: ['OK']
      });
      alert.present();
    })
  }

  openPlaylist(id, title) {
    this.navCtrl.push('PlaylistPage', { id: id, title: title });
  }

  getImgUrl(video){
    if(video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.default){
      return video.snippet.thumbnails.default.url;
    }else{
      return null;
    }
  }

}
