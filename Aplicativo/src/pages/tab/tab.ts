import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActivitiesPage } from '../activities/activities';
import { DocumentsPage } from '../documents/documents';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html'
})

export class TabPage {

  tab1Root: any = ActivitiesPage;
  tab2Root: any = DocumentsPage;
  public params;
  public activities;
  public documents;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.params = {
      name: this.navParams.get('name'),
      username: this.navParams.get('username')
    };

    this.translate.get('MESSAGE_TAB_1').subscribe( value => {this.activities = value})
    this.translate.get('MESSAGE_TAB_2').subscribe( value => {this.documents = value})
  }
}
