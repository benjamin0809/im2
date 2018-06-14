import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
 

import { JmessageServiceProvider } from '../../providers/jmessage-service/jmessage-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public Jmessage: JmessageServiceProvider,
    public events: Events) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.events.subscribe('user-login',()=>{
      this.navCtrl.setRoot(MainPage);
    });
  }

  // Attempt to login in through our User service
  doLogin() {
    // alert(JSON.stringify(this.account))

    if(!this.account.username){
      alert("用户名不能为空")
      return;
    }
    if(!this.account.password){
      alert("密码不能为空")
      return;
    }
    this.Jmessage.login(this.account);
    // .then((result)=>{
    //   this.navCtrl.setRoot(MainPage);
    // }) ;
  }

  goRegister(){
    this.navCtrl.push('SignupPage');
  }
}
