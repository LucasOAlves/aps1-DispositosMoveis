import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }
}
