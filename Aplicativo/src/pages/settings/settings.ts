import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  public language;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.language = 'en';
  }

  changeLanguage(){
    this.translate.use(this.language);
  }
}
