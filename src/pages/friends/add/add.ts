import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { JmessageServiceProvider } from '../../../providers/jmessage-service/jmessage-service';
/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {


  q_value: string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public Jmessage: JmessageServiceProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  getItems(ev) {
    let val = ev.target.value;
    if (val ) {
      this.q_value = val;
    }  
  }

  sendInvitationRequest(){
    if(this.q_value){
      this.Jmessage.sendInvitationRequest(this.q_value,"想添加你为好友").then((result)=>{
        alert("sendInvitationRequest:" + JSON.stringify(result));
        alert("send successful")
      }).catch((error)=>{
        alert("sendInvitationRequest error:"+JSON.stringify(error));
      }) 
    }
  }

}
