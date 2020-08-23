import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { Post, WordpressProvider } from "../../../../providers/wordpress/wordpress";

@IonicPage()
@Component({
  selector: 'page-wordpress-home',
  templateUrl: 'wordpress-home.html',
})
export class WordpressHomePage {
  loader: Loading;
  posts: any;

  constructor(public navCtrl: NavController, public wpProvider: WordpressProvider, public loadingCtrl: LoadingController) {
    this.presentLoading();
    this.posts = this.wpProvider.getPosts();
    this.posts.subscribe(data => {
      this.loader.dismiss();
    });
  }

  getUserImage(id: number) {
    return this.wpProvider.getUserImage(id);
  }

  getUserName(id: number) {
    return this.wpProvider.getUserName(id);
  }

  openPost(post: Post) {
    this.navCtrl.push('WordpressPostPage', { post: post });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Loading..."
    });
    this.loader.present();
  }
}
