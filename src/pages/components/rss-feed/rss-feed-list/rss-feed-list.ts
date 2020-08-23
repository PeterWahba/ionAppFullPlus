import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RssFeedProvider, Feed, FeedItem } from "../../../../providers/rss-feed/rss-feed";
import { SocialSharing } from "@ionic-native/social-sharing";


@IonicPage()
@Component({
  selector: 'page-rss-feed-list',
  templateUrl: 'rss-feed-list.html',
})
export class RssFeedListPage {

  articles: FeedItem[];
  selectedFeed: Feed;
  loading: Boolean;
 
  constructor(private iab: InAppBrowser, private feedProvider: RssFeedProvider, private navParams: NavParams,
  private socialShare: SocialSharing) {
    this.selectedFeed = this.navParams.get('selectedFeed');
  }
 
  public openArticle(url: string) {
    this.iab.create(url, '_blank');
    // window.open(url, '_blank');
  }
 
  loadArticles() {
    this.loading = true;
    this.feedProvider.getArticlesForUrl(this.selectedFeed.url).subscribe(res => {
      this.articles = res;
      this.loading = false;
    });
  }
 
  public ionViewWillEnter() {
    if (this.selectedFeed !== undefined && this.selectedFeed !== null ) {
      this.loadArticles()
    } else {
      this.feedProvider.getSavedFeeds().then(
        feeds => {
          if (feeds.length > 0) {
            let item = feeds[0];
            this.selectedFeed = new Feed(item.title, item.url);
            this.loadArticles();
          }
        }
      );
    }
  }

  share(link){
    if (!!link) {
      this.socialShare.share('Checkout this post: ', 'Checkout this post: ', link, '');
    } else{
      alert('No file to share');
    }
  }
}
