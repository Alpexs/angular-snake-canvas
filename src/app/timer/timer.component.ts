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
  headerText = '';
  currentState;
  time;
  constructor(private gameService: GameService) {
  }


  ngOnInit() {
    this.gameService.selectedState.subscribe(state => {
      this.currentState = state;
      if (state === GameState.Started || state === GameState.New) {
        this.headerText = 'click to restart';

      }
      if (state === GameState.Ended) {
        this.timeOver();
      }
    });
  }
  timeOver() {
    this.headerText = 'click to restart';
  }
}
