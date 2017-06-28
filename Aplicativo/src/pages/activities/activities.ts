import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})

export class ActivitiesPage {

  public activities;
  public discipline;
  public username;
  public message;
  public messageError;
  public colorSelector;
  public messageErrorChecked;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public db: SQLStorage,
    public toast: ToastController,
    public translate: TranslateService) {
      // Get params
      this.discipline = this.navParams.get('name');
      this.username = this.navParams.get('username');

      // Initialize
      this.message = '';
      this.colorSelector = 'white';
      this.translate.get('MESSAGE_ACTIVITY_12').subscribe( value => {this.messageErrorChecked = value})
      this.translate.get('MESSAGE_ACTIVITY_1').subscribe( value1 => {
        this.translate.get('MESSAGE_ACTIVITY_2').subscribe( value2 => {
          this.messageError = value1 + this.discipline + '. ' + value2;
        });
      });

      // Load activities
      this.loadActivities();
    }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // back home function
  backHome(){
    this.appCtrl.goBack();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Add new activity in the timeline atctivities
  addAtv(){
    let addActivity = this.alertCtrl.create();

    let a, b, c;
    this.translate.get('ACTIVITY_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DESCRIPTION').subscribe( value => {b = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DATE').subscribe( value => {c = value});

    this.translate.get('ACTIVITY_ADD').subscribe( value => {addActivity.setTitle(value)});
    addActivity.addInput(this.inputParam('text',a,'name',''));
    addActivity.addInput(this.inputParam('text',b,'description',''));
    addActivity.addInput(this.inputParam('date',c,'date',''));

    addActivity.addButton({
      text: 'Add',
      handler: (result) => {
        (result.name.length > 0) ? this.insertActivity(result.name,result.description,result.date) :
        this.translate.get('MESSAGE_ACTIVITY_3').subscribe( value => {this.showToast(value)});
      }
    });

    addActivity.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Edit activity from timeline atctivities
  editAtv(name,description,date){
    let editActivity = this.alertCtrl.create();
    let a, b, c;
    this.translate.get('ACTIVITY_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DESCRIPTION').subscribe( value => {b = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DATE').subscribe( value => {c = value});

    this.translate.get('ACTIVITY_EDIT').subscribe( value => {editActivity.setTitle(value)});
    editActivity.addInput(this.inputParam('text',a,'name',name));
    editActivity.addInput(this.inputParam('text',b,'description',description));
    editActivity.addInput(this.inputParam('date',c,'date',date));

    editActivity.addButton({
      text: 'Save',
      handler: (result) => {
        (result.name.length > 0) ? this.updateActivity(name,result.name,result.description,result.date) :
        this.translate.get('MESSAGE_ACTIVITY_3').subscribe( value => {this.showToast(value)});
      }
    });

    editActivity.present();
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
  // Load Activities
  loadActivities(){
    this.activities = [];
    this.db.query('SELECT * FROM activity WHERE username = ? and discipline = ? ORDER BY name',
                                                                      [this.username, this.discipline]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.activities.push({
            name: result.item(i).name,
            date: result.item(i).date,
            description: result.item(i).description,
            checked: result.item(i).checked
          });
          console.log('Activity ' + result.item(i).name + ' load successfully!!');
        }

        // Verify message error
        (this.activities.length < 1) ? this.message = this.messageError : this.message = '';
      });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Insert new activoty
  insertActivity(name, description, date){
    this.db.query('INSERT INTO activity (username,discipline,name,description,date,checked) VALUES (?,?,?,?,?,?)',
                      [this.username,this.discipline,name,description,date,false]).
                      then(result => {
                        console.log('Activity added successfully: ' + name);
                        this.translate.get('MESSAGE_ACTIVITY_4').subscribe( value => {this.showToast(value + name)});
                    }).catch(result => {
                      this.translate.get('MESSAGE_ACTIVITY_5').subscribe( value => {this.showToast(value)});
                    });
    this.loadActivities();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete Activity
  deleteActivity(name){
    this.db.query('DELETE FROM activity WHERE username = ? and discipline = ? and name = ?',
                      [this.username,this.discipline,name]).
                      then(result => {
                        console.log('Activity deleted successfully: ' + name);
                        this.translate.get('MESSAGE_ACTIVITY_6').subscribe( value => {this.showToast(value + name)});
                      });
    this.loadActivities();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Update Activity
  updateActivity(oldName,newName,newDescription,newDate){
    this.db.query('UPDATE activity SET name = ?, description = ?, date = ? WHERE ' +
                                                              'username = ? and discipline = ? and name = ?',
                      [newName,newDescription,newDate,this.username,this.discipline, oldName]).
                      then(result => {
                        console.log('Activity updated successfully: ' + oldName);
                        this.translate.get('MESSAGE_ACTIVITY_7').subscribe( value => {this.showToast(value + oldName)});
                      }).catch(result => {
                        this.translate.get('MESSAGE_ACTIVITY_5').subscribe( value => {this.showToast(value)});
                      });
    this.loadActivities();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Update Status Activity
  changeStatusCheck(status,name){
    this.db.query('UPDATE activity SET checked = ? WHERE username = ? and discipline = ? and name = ?',
                      [status.checked,this.username,this.discipline, name]).
          then(result => {console.log('Activity status changed and updated to '+ status.checked + ' successfully: ' + name)});
    //this.loadActivities();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete confirmation
  deleteConfirm(name) {
    let a, b, c, d;
    this.translate.get('MESSAGE_ACTIVITY_8').subscribe( value => {a = value})
    this.translate.get('MESSAGE_ACTIVITY_9').subscribe( value => {b = value})
    this.translate.get('MESSAGE_ACTIVITY_10').subscribe( value => {c = value})
    this.translate.get('MESSAGE_ACTIVITY_11').subscribe( value => {d = value})

    let alert = this.alertCtrl.create({
      title: a,
      message: b + name + '"?',
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
            this.deleteActivity(name);
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
  // Select Done and Undone Activity
  selectDone(){
    if(this.colorSelector === 'white'){
      this.colorSelector = 'green';
      //checked
      this.loadActivitiesChecked(true);
    }else if(this.colorSelector === 'green'){
      this.colorSelector = 'red';
      //unchecked
      this.loadActivitiesChecked(false);
    }else if(this.colorSelector === 'red'){
      this.colorSelector = 'white';
      this.loadActivities();
    }
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Select Done and Undone Activity
  loadActivitiesChecked(value){
    this.activities = [];
    this.db.query('SELECT * FROM activity WHERE username = ? and discipline = ? and checked = ? ORDER BY name',
                                                                      [this.username, this.discipline, value]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.activities.push({
            name: result.item(i).name,
            date: result.item(i).date,
            description: result.item(i).description,
            checked: result.item(i).checked
          });
          console.log('Activity ' + result.item(i).name + ' load successfully!!');
        }

        // Verify message error
        (this.activities.length < 1) ? this.message = this.messageErrorChecked : this.message = '';
      });
  }
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // End of code
}
