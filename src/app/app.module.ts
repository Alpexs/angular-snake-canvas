import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TimerComponent } from './timer/timer.component';
import { ActionsComponent } from './actions/actions.component';
import { SnakeComponent } from './snake/snake.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TimerComponent,
    ActionsComponent,
    SnakeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
