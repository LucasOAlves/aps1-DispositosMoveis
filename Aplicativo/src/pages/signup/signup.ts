import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { MenuPage } from '../menu/menu';
import { SQLStorage } from '../../providers/sql-storage';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {

  public formSignUp;
  public name;
  public username;
  public email;
  public password1;
  public password2;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: SQLStorage,
              public formBuilder: FormBuilder,
              public toast: ToastController) {

    // Template from form
    this.formSignUp = formBuilder.group({
        nameV: ['', Validators.compose([
                            Validators.maxLength(30),
                            Validators.minLength(2),
                            Validators.pattern('[a-zA-Z ]*'),
                            Validators.required])],

        usernameV: ['', Validators.compose([
                            Validators.maxLength(30),
                            Validators.minLength(4),
                            Validators.pattern('[a-zA-Z0-9]*'),
                            Validators.required])],

        emailV: ['', Validators.compose([
                            Validators.maxLength(30),
                            Validators.pattern('[a-zA-Z0-9]*@[a-zA-Z]*.com*'),
                            Validators.required])],

        passwordV1: ['', Validators.compose([
                            Validators.minLength(8),
                            Validators.maxLength(15),
                            Validators.pattern('[a-zA-Z0-9]*'),
                            Validators.required])],

        passwordV2: ['', Validators.compose([
                            Validators.minLength(8),
                            Validators.maxLength(15),
                            Validators.pattern('[a-zA-Z0-9]*'),
                            Validators.required])]
    });

  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Call the back page - login
  backLoginPage(){
    this.navCtrl.setRoot(LoginPage);
  }

  /*******************************************************************************************************/
  /*******************************************************************************************************/
  /*******************************************************************************************************/
  // Create a new account
  createAccount(){
    /*
    if(!this.formSignUp.valid){
      console.log('Invalid form');
      this.showToast('Invalid form');
    }else if(this.validUsername()){
      console.log('Username invalid');
      this.showToast('Username already registered');
    }else {
      console.log('Valid form');
      console.log(this.validUsername());
      this.db.query('INSERT INTO login (username,name,email,password) VALUES (?,?,?,?)',
                        [this.username,this.name,this.email,this.password1]).
                        then(result => {console.log('User create successfully: ' + this.name)});
      this.navCtrl.setRoot(MenuPage,{
        username: this.username
      });*/

      if(!this.formSignUp.valid){
        console.log('Invalid form');
        this.showToast('Invalid form');
      }else {
        console.log('Valid form');
        this.db.query('INSERT INTO login (username,name,email,password) VALUES (?,?,?,?)',
                      [this.username,this.name,this.email,this.password1]).
                        then(result => {
                          console.log('User create successfully: ' + this.name);
                          this.navCtrl.setRoot(MenuPage,{
                            username: this.username
                          });
                        }).catch(result =>{
                          this.showToast('Username already exists');
                        });
    }
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
}
