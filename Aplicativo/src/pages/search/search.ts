import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {

  public username;
  public disciplines;
  public message;
  public searchInput;
  public messageSearch;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: SQLStorage,
              public translate: TranslateService){

      // Load username
      this.username = this.navParams.get('username');
      // Initialize variable
      this.message = '';
      this.searchInput = '';
      this.messageSearch = '';

      if(this.searchInput.length < 1){
        this.translate.get('MESSAGE_SEARCH_1').subscribe( value => {this.messageSearch = value});
        this.disciplines = [];
      }
  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Search Bar event
  onInput(event){
    //console.log('SELECT * FROM discipline WHERE username = ? AND name ILIKE \'%?\' ORDER BY name');
    this.disciplines = [];
    this.db.query('SELECT * FROM discipline WHERE username = ? AND name LIKE \'%'+ this.searchInput +'%\' ORDER BY name',[this.username]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.disciplines.push({
            name: result.item(i).name,
            description: result.item(i).description,
            classroom: result.item(i).classroom
          });
        }

        // Verify message error
        if(this.disciplines.length < 1 && this.searchInput.length > 0){
          this.translate.get('MESSAGE_SEARCH_2').subscribe( value => {this.messageSearch = value});
        }else{
            this.messageSearch = '';
        }

        if(this.searchInput.length < 1){
          this.translate.get('MESSAGE_SEARCH_1').subscribe( value => {this.messageSearch = value});
          this.disciplines = [];
        }
      });
  }
}
