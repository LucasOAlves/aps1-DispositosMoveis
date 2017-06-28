import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-progress',
  templateUrl: 'progress.html'
})

export class ProgressPage {

  public disciplines;
  public data;
  public username;
  public message;
  public messageError;
  public searchInput;
  public messageSearch;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: SQLStorage, public translate: TranslateService) {
    // Get params
    this.username = this.navParams.get('username');

    // Initialize
    this.disciplines = [];
    this.message = '';
    this.searchInput = '';
    this.messageSearch = '';
    this.translate.get('MESSAGE_PROGRESS_1').subscribe( value => {this.messageError = value});

    // Load disciplines
    this.loadDisciplines();
  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Load disciplines from database
  loadDisciplines(){
    this.disciplines = [];
    this.db.query('SELECT name FROM discipline WHERE username = ? ORDER BY name',[this.username]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.disciplines.push({
            name: result.item(i).name
          });
          console.log('Discipline ' + result.item(i).name + ' load successfully!!');
        }

        // Load information
        this.loadInformation();
        // Verify message error
        (this.disciplines.length < 1) ? this.message = this.messageError : this.message = '';
      });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Load data information
  loadInformation(){
    this.data = [];

    for(let j = 0;j < this.disciplines.length;j++){
      this.makeCall(this.disciplines[j].name);
    }
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Calculate values
  makeCall(discipline){
    let querys = ['SELECT count(*) as value FROM activity WHERE username = ? AND discipline = ?',
                  'SELECT count(*) as value FROM document WHERE username = ? AND discipline = ?',
                  'SELECT count(*) as value FROM activity WHERE username = ? AND discipline = ? AND checked = ?',
                  'SELECT count(*) as value FROM document WHERE username = ? AND discipline = ? AND checked = ?'];
    let totalA = 0;
    let totalD = 0;
    let trueA = 0;
    let trueD = 0;

    this.db.query(querys[0],[this.username,discipline]).then(data => {
      totalA = data.res.rows.item(0).value; // Total Activities
      this.db.query(querys[1],[this.username,discipline]).then(data => {
            totalD = data.res.rows.item(0).value; // Total Documents
            this.db.query(querys[2],[this.username,discipline,true]).then(data => {
                  trueA = data.res.rows.item(0).value; // Total Activities Checked
                  this.db.query(querys[3],[this.username,discipline,true]).then(data => {
                        trueD = data.res.rows.item(0).value; // Total Documents checked

                        // Set data
                        this.data.push({
                          name: discipline,
                          totalA: totalA,
                          A: (totalA > 0) ? ((trueA/totalA)*100).toFixed(1) : (0).toFixed(1),
                          totalD: totalD,
                          D: (totalD > 0) ? ((trueD/totalD)*100).toFixed(1) : (0).toFixed(1),
                          total: (totalA + totalD),
                          T: (totalA > 0 || totalD > 0) ? (((trueD+trueA)/(totalA+totalD))*100).toFixed(1) : (0).toFixed(1)
                        });

                        totalA = totalD = trueA = trueD = 0;
                      });
                });
          });
      });
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

        this.loadInformation();
      });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // End of code
}
