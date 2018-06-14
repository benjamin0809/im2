import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, Tabs,Events } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root } from '../';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('mainTabs') 
  tabRef:Tabs;

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;

  tab1Title = "Messages";
  tab2Title = "Contacts";
  tab3Title = "My";

  newMessageCount: number = 0;
  newFirendsCount: number = 0;
  newMomentsCount: number = 0;

  constructor(public navCtrl: NavController, 
    public translateService: TranslateService,
   public events: Events) {

    // 当收到推送消息时（此时将消息存储）
    this.events.subscribe('jmessage.notificationReceived', () => {
      // alert("tabs.ts jmessage.notificationReceived")
      this.newMessageCount ++;
      this._setTabMessageBadge();
    });

    this.events.subscribe('resetBadge-listmaster',(count)=>{
      this.newMessageCount = count;
    })

    // translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
    //   this.tab1Title = values['TAB1_TITLE'];
    //   this.tab2Title = values['TAB2_TITLE'];
    //   this.tab3Title = values['TAB3_TITLE'];
    // });
  }

  ionChange(){
    // if(this.tabRef.getSelected().index==1){
    //    this.newMessageCount=0;
    //    this._setTabMessageBadge();
    // }
  };

  selectTab(index){
    this.tabRef.select(index);
    this.ionChange();
  }

  _setTabMessageBadge(){
    if(this.newMessageCount==0){
      this.tabRef.getByIndex(0).tabBadge = "";
   }else{
     this.tabRef.getByIndex(0).tabBadge = this.newMessageCount.toString();
   }
  }

  resetUnreadCount(){

  }
}
