import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationPage } from './conversation';
import { PipesModule } from '../../../pipes/pipes.module'; 
@NgModule({
  declarations: [
    ConversationPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationPage),
    PipesModule
  ],
})
export class ConversationPageModule {}
