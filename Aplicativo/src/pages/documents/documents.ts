import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { SQLStorage } from '../../providers/sql-storage';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})

export class DocumentsPage {

  public documents;
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
      this.translate.get('MESSAGE_DOCUMENT_9').subscribe( value => {this.messageErrorChecked = value})
      this.translate.get('MESSAGE_DOCUMENT_1').subscribe( value1 => {
        this.translate.get('MESSAGE_DOCUMENT_2').subscribe( value2 => {
          this.messageError = value1 + this.discipline + '. ' + value2;
        });
      });

      // Load activities
      this.loadDocuments();
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
  // Alert add Document
  addDoc(){
    let addDocument = this.alertCtrl.create();
    let a, b, c, d;
    this.translate.get('DOCUMENT_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('DOCUMENT_PLACEHOLDER_RESPONSIBLE').subscribe( value => {b = value});
    this.translate.get('DOCUMENT_PLACEHOLDER_LOCAL').subscribe( value => {c = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DATE').subscribe( value => {d = value});

    this.translate.get('DOCUMENT_ADD').subscribe( value => {addDocument.setTitle(value)});
    addDocument.addInput(this.inputParam('text',a,'name',''));
    addDocument.addInput(this.inputParam('text',b,'responsible',''));
    addDocument.addInput(this.inputParam('text',c,'local',''));
    addDocument.addInput(this.inputParam('date',d,'date',''));

    addDocument.addButton({
      text: 'Add',
      handler: (result) => {
        (result.name.length > 0) ? this.insertDocument(result.name,result.date,result.responsible,result.local) :
        this.translate.get('MESSAGE_DOCUMENT_3').subscribe( value => {this.showToast(value)});
      }
    });

    addDocument.present();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Alert edit document
  editDoc(name,responsible,local,date){
    let editDocument = this.alertCtrl.create();
    let a, b, c, d;
    this.translate.get('DOCUMENT_PLACEHOLDER_NAME').subscribe( value => {a = value});
    this.translate.get('DOCUMENT_PLACEHOLDER_RESPONSIBLE').subscribe( value => {b = value});
    this.translate.get('DOCUMENT_PLACEHOLDER_LOCAL').subscribe( value => {c = value});
    this.translate.get('ACTIVITY_PLACEHOLDER_DATE').subscribe( value => {d = value});

    this.translate.get('DOCUMENT_EDIT').subscribe( value => {editDocument.setTitle(value)});
    editDocument.addInput(this.inputParam('text',a,'name',name));
    editDocument.addInput(this.inputParam('text',b,'responsible',responsible));
    editDocument.addInput(this.inputParam('text',c,'local',local));
    editDocument.addInput(this.inputParam('date',d,'date',date));

    editDocument.addButton({
      text: 'Save',
      handler: (result) => {
        (result.name.length > 0) ? this.updateDocument(name,result.name,result.date,result.responsible,result.local) :
        this.translate.get('MESSAGE_DOCUMENT_3').subscribe( value => {this.showToast(value)});
      }

    });

    editDocument.present();
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
  loadDocuments(){
    this.documents = [];
    this.db.query('SELECT * FROM document WHERE username = ? and discipline = ? ORDER BY name',
                                                                      [this.username, this.discipline]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.documents.push({
            name: result.item(i).name,
            date: result.item(i).date,
            responsible: result.item(i).responsible,
            local: result.item(i).local,
            checked: result.item(i).checked
          });
          console.log('Document ' + result.item(i).name + ' load successfully!!');
        }

        // Verify message error
        (this.documents.length < 1) ? this.message = this.messageError : this.message = '';
      });
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Insert new activoty
  insertDocument(name, date, responsible, local){
    this.db.query('INSERT INTO document (username,discipline,name,date,responsible,local,checked) VALUES (?,?,?,?,?,?,?)',
                      [this.username,this.discipline,name,date,responsible,local,false]).
                      then(result => {
                        console.log('Document added successfully: ' + name);
                        this.translate.get('MESSAGE_DOCUMENT_4').subscribe( value => {this.showToast(value + name)});
                      }).catch(result => {
                        this.translate.get('MESSAGE_DOCUMENT_5').subscribe( value => {this.showToast(value)});
                      });
    this.loadDocuments();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete Activity
  deleteDocument(name){
    this.db.query('DELETE FROM document WHERE username = ? and discipline = ? and name = ?',
                      [this.username,this.discipline,name]).
                      then(result => {
                        console.log('Document deleted successfully: ' + name);
                        this.translate.get('MESSAGE_DOCUMENT_6').subscribe( value => {this.showToast(value + name)});
                      });
    this.loadDocuments();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Update Activity
  updateDocument(oldName,newName,newDate,newResponsible,newLocal){
    this.db.query('UPDATE document SET name = ?, date = ?, responsible = ?, local = ? WHERE ' +
                                                              'username = ? and discipline = ? and name = ?',
                      [newName,newDate,newResponsible,newLocal,this.username,this.discipline, oldName]).
                      then(result => {
                        console.log('Document updated successfully: ' + oldName);
                        this.translate.get('MESSAGE_DOCUMENT_7').subscribe( value => {this.showToast(value + oldName)});
                      }).catch(result => {
                        this.translate.get('MESSAGE_DOCUMENT_5').subscribe( value => {this.showToast(value)});
                      });
    this.loadDocuments();
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Update Status Activity
  changeStatusCheck(status,name){
    this.db.query('UPDATE document SET checked = ? WHERE username = ? and discipline = ? and name = ?',
                      [status.checked,this.username,this.discipline, name]).
          then(result => {console.log('Document status changed and updated to '+ status.checked + ' successfully: ' + name)});
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Delete confirmation
  deleteConfirm(name) {
    let a, b, c, d;
    this.translate.get('MESSAGE_ACTIVITY_8').subscribe( value => {a = value})
    this.translate.get('MESSAGE_DOCUMENT_8').subscribe( value => {b = value})
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
            this.deleteDocument(name);
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
      this.loadDocumentsChecked(true);
    }else if(this.colorSelector === 'green'){
      this.colorSelector = 'red';
      //unchecked
      this.loadDocumentsChecked(false);
    }else if(this.colorSelector === 'red'){
      this.colorSelector = 'white';
      this.loadDocuments();
    }
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Select Done and Undone Activity
  loadDocumentsChecked(value){
    this.documents = [];
    this.db.query('SELECT * FROM document WHERE username = ? and discipline = ? and checked = ? ORDER BY name',
                                                                      [this.username, this.discipline, value]).
      then(data => {
        let result = data.res.rows;
        for(let i = 0; i < result.length; i++){
          this.documents.push({
            name: result.item(i).name,
            date: result.item(i).date,
            responsible: result.item(i).responsible,
            local: result.item(i).local,
            checked: result.item(i).checked
          });
          console.log('Document ' + result.item(i).name + ' load successfully!!');
        }

        // Verify message error
        (this.documents.length < 1) ? this.message = this.messageErrorChecked : this.message = '';
      });
  }
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // End of code
}
