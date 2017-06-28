import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { TabPage } from '../tab/tab';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public username;
  public disciplines;
  public message;
  public searchInput;
  public messageError;
  public messageSearch;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public db: SQLStorage,
              public toast: ToastController,
              public translate: TranslateService){

    // Load username
    this.username = this.navParams.get('username');
    // Print user log
    console.log('User: ' + this.username);
    // Initialize variable
    this.message = '';
    this.searchInput = '';
    this.messageSearch = '';
    this.translate.get('HOME_MESSAGE_ERROR_1').subscribe( value => {this.messageError = value})
    // Load data about username
    this.loadDisciplines();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Open Settings Page
  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Open tabs Atctivty and Documents
  activitiesCall(name){
    this.navCtrl.push(TabPage,{
      name: name,
      username: this.username
    });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Alert dit document
  editDiscipline(name,description,classroom){
    let editDiscipline = this.alertCtrl.create();
    let a, b, c;
    this.translate.get('HOME_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('HOME_PLACEHOLDER_DESCRIPTIOM').subscribe( value => {b = value});
    this.translate.get('HOME_PLACEHOLDER_CLASSROOM').subscribe( value => {c = value});

    this.translate.get('HOME_EDIT_DISCIPLINE').subscribe( value => {editDiscipline.setTitle(value)});
    editDiscipline.addInput(this.inputParam('text',a,'name',name));
    editDiscipline.addInput(this.inputParam('text',b,'description',description));
    editDiscipline.addInput(this.inputParam('text',c,'classroom',classroom));

    editDiscipline.addButton({
      text: 'Save',
      handler: (result) => {
        (result.name.length > 0) ? this.updateDiscipline(name,result.name,result.description,result.classroom) :
        this.translate.get('HOME_MESSAGE_ERROR_2').subscribe( value => {this.showToast(value)});
      }
    });

    editDiscipline.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // add new disciplines
  addDiscipline(){
    let editDiscipline = this.alertCtrl.create();
    let a, b, c;
    this.translate.get('HOME_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('HOME_PLACEHOLDER_DESCRIPTIOM').subscribe( value => {b = value});
    this.translate.get('HOME_PLACEHOLDER_CLASSROOM').subscribe( value => {c = value});

    this.translate.get('HOME_ADD_DISCIPLINE').subscribe( value => {editDiscipline.setTitle(value)});
    editDiscipline.addInput(this.inputParam('text',a,'name',''));
    editDiscipline.addInput(this.inputParam('text',b,'description',''));
    editDiscipline.addInput(this.inputParam('text',c,'classroom',''));

    editDiscipline.addButton({
      text: 'Add',
      handler: (result) => {
        (result.name.length > 0) ? this.insertDiscipline(result.name,result.description,result.classroom) :
        this.translate.get('HOME_MESSAGE_ERROR_2').subscribe( value => {this.showToast(value)});
      }
    });

    editDiscipline.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Construct a variable to input
  inputParam(type,placeholder,name,value){
    let params = {
      type: type,
      placeholder: placeholder,
      name: name,
      value: value
    }
    return params;
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Load disciplines from database
  loadDisciplines(){
    this.disciplines = [];
    this.db.query('SELECT * FROM discipline WHERE username = ? ORDER BY name',[this.username]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.disciplines.push({
            name: result.item(i).name,
            description: result.item(i).description,
            classroom: result.item(i).classroom
          });
          console.log('Discipline ' + result.item(i).name + ' load successfully!!');
        }

        // Verify message error
        (this.disciplines.length < 1) ? this.message = this.messageError : this.message = '';
      })
      .catch(result => {console.log('Load Error!!')});
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Insert discipline in the database
  insertDiscipline(name,description,classroom){
    this.db.query('INSERT INTO discipline (username,name,description,classroom) VALUES (?,?,?,?)',
                      [this.username,name,description,classroom])
                      .then(result => {console.log('Discipline added successfully: ' + name);
                        this.translate.get('HOME_MESSAGE_ERROR_3').subscribe( value => {this.showToast(value + name)})})
                      .catch(result => {console.log('Error insert new Discipline. This discipline name already exists.');
                        this.translate.get('HOME_MESSAGE_ERROR_4').subscribe( value => {this.showToast(value)})});
    this.loadDisciplines();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete discipline from database
  deleteDiscipline(name){
    this.db.query('DELETE FROM discipline WHERE username = ? and name = ?', [this.username,name]).
                      then(result => {
                        console.log('Discipline deleted successfully: ' + name)
                        this.db.query('DELETE FROM activity WHERE username = ? and discipline = ?', [this.username,name]);
                        this.db.query('DELETE FROM document WHERE username = ? and discipline = ?', [this.username,name]);
                        this.translate.get('HOME_MESSAGE_ERROR_5').subscribe( value => {this.showToast(value + name)})})
                        .catch(result => {console.log('Error delete!!')});

    this.loadDisciplines();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Update discipline from database
  updateDiscipline(oldName, newName, newDescription, newClassroom){
    this.db.query('UPDATE discipline SET name = ?, description = ?, classroom = ? WHERE username = ? and name = ?',
                      [newName,newDescription,newClassroom,this.username,oldName]).
                      then(result => {
                        console.log('Discipline updated successfully: ' + oldName);
                        this.db.query('UPDATE activity SET discipline = ? WHERE username = ? and discipline = ?',
                                          [newName,this.username,oldName]);
                        this.db.query('UPDATE document SET discipline = ? WHERE username = ? and discipline = ?',
                                          [newName,this.username,oldName]);
                        this.translate.get('HOME_MESSAGE_ERROR_6').subscribe( value => {this.showToast(value + oldName)})
                      }).catch(result => {
                        this.translate.get('HOME_MESSAGE_ERROR_4').subscribe( value => {this.showToast(value)})
                      });

    this.loadDisciplines();
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
        (this.disciplines.length < 1) ? this.translate.get('MESSAGE_SEARCH_2').subscribe( value => {this.messageSearch = value}) :
        this.messageSearch = '';
      });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete confirmation
  deleteConfirm(name) {
    let a, b, c, d;
    this.translate.get('MESSAGE_ACTIVITY_8').subscribe( value => {a = value})
    this.translate.get('HOME_MESSAGE_ERROR_7').subscribe( value => {b = value})
    this.translate.get('MESSAGE_ACTIVITY_10').subscribe( value => {c = value})
    this.translate.get('MESSAGE_ACTIVITY_11').subscribe( value => {d = value})

    let alert = this.alertCtrl.create({
      title: a,
      message: b + name +'"?',
      buttons: [
        {
          text: c,
          role: 'cancel',
          handler: () => {
            console.log('Cancel delete!');
          }
        },
        {
          text: d,
          handler: () => {
            this.deleteDiscipline(name);
          }
        }
      ]
    });
    alert.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Show toast
  showToast(message){
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      showCloseButton: true
    });
    toast.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // End of code
}
