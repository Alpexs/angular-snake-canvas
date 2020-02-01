import { Component, OnInit } from '@angular/core';
import { GameState } from '../GameState';
import { GameService } from '../game.service';
import { timer } from 'rxjs';
import { take, max } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  headerText = 'Click to start a game';
  currentState;
  time;
  constructor(private gameService: GameService ) {
   }


  ngOnInit() {
    this.gameService.selectedState.subscribe(state => {
      this.currentState = state;
      if (state === GameState.Started) {
        this.setupTimer();
      }
      if (state === GameState.Ended) {
        this.timeOver();
        this.time.unsubscribe();
      }
    });
  }

  setupTimer() {
    const maxTimer = 15;
    this.time = timer(0, 1000).pipe(take(maxTimer + 1)).subscribe(ec => {
      if ( ec === maxTimer || this.currentState === GameState.Ended ) {
        this.timeOver();
        this.gameService.setState(GameState.Ended);
        return;
      }
      this.headerText = 'Time left: ' + (maxTimer - ec) + ' s';
    });
  }
  timeOver() {
    this.headerText = 'Game over, score 0, click to restart';
  }
}
