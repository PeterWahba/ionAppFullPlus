import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from "../../../../providers/wordpress/wordpress";


@IonicPage()
@Component({
  selector: 'page-wordpress-post',
  templateUrl: 'wordpress-post.html',
})
export class WordpressPostPage {
  post: Post;
  
   constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.post = navParams.get('post');
   }
 }
