import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { RssFeedProvider, Feed } from "../../../../providers/rss-feed/rss-feed";

@IonicPage()
@Component({
  selector: 'page-rss-feed-home',
  templateUrl: 'rss-feed-home.html',
})
export class RssFeedHomePage {
  
   rootPage = 'FeedListPage';
   feeds: Feed[];
  
   constructor(private feedProvider: RssFeedProvider, public alertCtrl: AlertController, private nav: NavController) { }
  
   public addFeed() {
     let prompt = this.alertCtrl.create({
       title: 'Add Feed URL',
       inputs: [
         {
           name: 'name',
           placeholder: 'The best Feed ever'
         },
         {
           name: 'url',
           placeholder: 'http://www.yoursite.com/feed/'
         },
       ],
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel'
         },
         {
           text: 'Save',
           handler: data => {
             let newFeed = new Feed(data.name, data.url);
             this.feedProvider.addFeed(newFeed).then(
               res => {
                 this.loadFeeds();
               }
             );
           }
         }
       ]
     });
     prompt.present();
   }

   deleteFeed(feed){
      this.feedProvider.removeFeed(feed).then(()=>{
        this.loadFeeds();
      });
   }
  
   private loadFeeds() {
     this.feedProvider.getSavedFeeds().then(
       allFeeds => {
         this.feeds = allFeeds;
       });
   }
  
   public openFeed(feed: Feed) {
     this.nav.push('RssFeedListPage', { 'selectedFeed': feed });
   }
  
   public ionViewWillEnter() {
     this.loadFeeds();
   }
 }