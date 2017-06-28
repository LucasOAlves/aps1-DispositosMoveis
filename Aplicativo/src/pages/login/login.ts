import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { MenuPage } from '../menu/menu';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  public username;
  public password;
  public message;
  public path_logo;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: SQLStorage, public translate: TranslateService) {
    //Initialize
    this.message = '';
    this.username = '';
    this.password = '';
    this.translate.get('IMG_LOGIN').subscribe( value => {this.path_logo = value});

    // Create database
    this.db.create('activity_organizer');

    // Table describes
    let table_login = 'login(username VARCHAR(50),' +
                      'name VARCHAR(100),' +
                      'email VARCHAR(50),' +
                      'password VARCHAR(50),' +
                      'PRIMARY KEY (username))';

    let table_discipline = 'discipline(username VARCHAR(50),' +
                           'name VARCHAR(100),' +
                           'description TEXT,' +
                           'classroom VARCHAR(50),' +
                           'PRIMARY KEY (username,name),' +
                           'FOREIGN KEY (username) REFERENCES login(username) ' +
                           'ON DELETE CASCADE ON UPDATE CASCADE)';

    let table_activity = 'activity(username VARCHAR(50),' +
                         'discipline VARCHAR(100),' +
                         'name VARCHAR(50),' +
                         'description TEXT,' +
                         'date DATE,' +
                         'checked BOOLEAN,' +
                         'PRIMARY KEY (username,discipline,name),' +
                         'FOREIGN KEY (username,discipline) REFERENCES discipline(username,name))';

    let table_document = 'document(username VARCHAR(50),' +
                         'discipline VARCHAR(100),' +
                         'name VARCHAR(50),' +
                         'date DATE,' +
                         'responsible VARCHAR(100),' +
                         'local VARCHAR(100),' +
                         'checked BOOLEAN,' +
                         'PRIMARY KEY (username,discipline,name),' +
                         'FOREIGN KEY (username,discipline) REFERENCES discipline(username,name))';

    // Create tables
    this.db.query(`CREATE TABLE IF NOT EXISTS ${table_login}`).
                    then(data => {console.log("Table login create successfully!!")});
    this.db.query(`CREATE TABLE IF NOT EXISTS ${table_discipline}`).
                    then(data => {console.log("Table discipline create successfully!!")});
    this.db.query(`CREATE TABLE IF NOT EXISTS ${table_activity}`).
                    then(data => {console.log("Table activity create successfully!!")});
    this.db.query(`CREATE TABLE IF NOT EXISTS ${table_document}`).
                    then(data => {console.log("Table document create successfully!!")});
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Call the insert new user to the system
  signupPageCall(){
    this.navCtrl.push(SignupPage);
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Verify data and log in user
  login(){
    if(this.username.length > 0 && this.password.length > 0){
      this.db.query('SELECT * FROM login WHERE username = ? and password = ?',[this.username,this.password]).
        then(data => {
          let result = data.res.rows;
          if(result.length === 1){
            console.log("Login successfully!! User:" + this.username);
            this.navCtrl.setRoot(MenuPage,{
              username: this.username
            });
          }else{
            this.username = '';
            this.password = '';
            this.translate.get('MESSAGE_ERROR_LOGIN').subscribe( value => {this.message = value});
            console.log('Error!!');
          }
        });
    }else{
      this.translate.get('MESSAGE_ERROR_LOGIN').subscribe( value => {this.message = value});
    }
  }
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // End of code
}
