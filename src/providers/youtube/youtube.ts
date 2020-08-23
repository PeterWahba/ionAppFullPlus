import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { youtubeApiKey } from "../../config/config";

@Injectable()
export class YoutubeProvider {

  apiKey = youtubeApiKey;

  constructor(public http: Http) {
    console.log('Hello YoutubeProvider Provider');
  }

  getPlaylistsForChannel(channel) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?key=' + this.apiKey + '&channelId=' + channel + '&part=snippet,id&maxResults=20')
    .map((res) => {
      return res.json()['items'];
    })
  }
 
  getListVideos(listId) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&playlistId=' + listId +'&part=snippet,id&maxResults=20')
    .map((res) => {
      return res.json()['items'];
    })
  }

}
