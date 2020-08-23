import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
 
export class FeedItem {
  author: string;
  pubdate: string;
  description: string;
  link: string;
  title: string;
 
  constructor(description: string, link: string, title: string, author:string, pubdate: string) {
    this.description = description;
    this.link = link;
    this.title = title;
    this.author = author;
    this.pubdate = pubdate;
  }
}
 
export class Feed {
  title: string;
  url: string;
 
  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}
 
@Injectable()
export class RssFeedProvider {
 
  constructor(private http: Http, public storage: Storage) {}
  
   public getSavedFeeds() {
     return this.storage.get('savedFeeds').then(data => {
       if (data !== null && data !== undefined) {
         return JSON.parse(data);
       } else {
         return [];
       }
     });
   }
  
   public addFeed(newFeed: Feed) {
     return this.getSavedFeeds().then(arrayOfFeeds => {
       arrayOfFeeds.push(newFeed);
       let jsonString = JSON.stringify(arrayOfFeeds);
       return this.storage.set('savedFeeds', jsonString);
     });
   }

   public removeFeed(feed: Feed) {
    return this.getSavedFeeds().then(arrayOfFeeds => {
      
      let i = -1;
      arrayOfFeeds.forEach((e, index) => {
        if(e.title == feed.title && e.url == feed.url){
          i = index;
          return;
        }
      });
      arrayOfFeeds.splice(i,1);
      let jsonString = JSON.stringify(arrayOfFeeds);
      return this.storage.set('savedFeeds', jsonString);
    });
  }
  
   public getArticlesForUrl(feedUrl: string) {//'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22'+encodeURIComponent(feedUrl)
     var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D%22'+encodeURIComponent(feedUrl)+'%22&format=json';
     let articles = [];
     return this.http.get(url)
     .map((data) => {
      return data.json()['query']['results']
    })
     .map((res) => {
       if (res == null) {
         return articles;
       }
       let objects = res['item'];
       var length = 20;
  
       for (let i = 0; i < objects.length; i++) {
         let item = objects[i];
         var trimmedDescription = item.description.length > length ?
         item.description.substring(0, 500) + "..." :
         item.description;
         let newFeedItem = new FeedItem(trimmedDescription, item.link, item.title, item.creator, item.pubDate);
         articles.push(newFeedItem);
       }
       return articles
     })
   }
 }