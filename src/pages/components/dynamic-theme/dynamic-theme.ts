import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeManagerProvider } from "../../../providers/theme-manager/theme-manager";

@IonicPage()
@Component({
  selector: 'page-dynamic-theme',
  templateUrl: 'dynamic-theme.html',
})
export class DynamicThemePage {
  selectedTheme: String;

  constructor(public navCtrl: NavController, public navParams: NavParams,  private themeManager: ThemeManagerProvider) {
    this.themeManager.getActiveTheme().subscribe(val => this.selectedTheme = val);
    
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.themeManager.setActiveTheme('light-theme');
    } else {
      this.themeManager.setActiveTheme('dark-theme');
    }
  }

}
