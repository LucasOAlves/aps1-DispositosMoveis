import { Component } from '@angular/core';
import { NavController, NavParams, IonicApp } from 'ionic-angular';
import { SQLStorage } from '../../providers/sql-storage';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { ProgressPage } from '../progress/progress';
import { SettingsPage } from '../settings/settings';
import { SearchPage } from '../search/search';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {

  public params;
  public user;
  public username;
  public currentPage = HomePage;
  public home = HomePage;
  public progress = ProgressPage;
  public settings = SettingsPage;
  public search = SearchPage;
  public about = AboutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: IonicApp,public db: SQLStorage) {
    this.username = this.navParams.get('username');

    this.params = {
      username: this.username
    };

    this.getUser();
  }

  open(page){
    this.navCtrl.push(page,this.params);
  }

  logout(){
    this.navCtrl.setRoot(LoginPage);
  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  getUser(){
    this.db.query('SELECT * FROM login WHERE username = ?',[this.username]).
      then(data => {
        this.user = data.res.rows.item(0).name;
      });
  }
}
