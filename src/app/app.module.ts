import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TimerComponent } from './timer/timer.component';
import { ActionsComponent } from './actions/actions.component';
import { SnakeComponent } from './snake/snake.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'register', component: HomeComponent },
  { path: 'play',      component: BoardComponent },
  { path: 'leaderboard',      component: LeaderboardComponent },
  { path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TimerComponent,
    ActionsComponent,
    SnakeComponent,
    LeaderboardComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
