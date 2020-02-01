import { Component, OnInit } from '@angular/core';
import {GameState} from './../GameState';
import { GameService } from '../game.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  state: GameState;
  inPause: boolean;
  gameStarted: boolean;
  currentTimer = 0;
  constructor(private gameService: GameService) {}

  ngOnInit() {
   // tslint:disable-next-line: deprecation
   this.gameService.selectedState.subscribe ( state => {
     this.updateState(state);
   });
  }

  updateState(state: GameState) {
    this.state = state;
    this.gameStarted = false;
    if (state !== GameState.New) {
      this.boardClick();
    }

    console.log(state, 'currentState updated');
  }

  boardClick() {
    switch (this.state) {
      case GameState.New:
        this.startGame();
        break;
      case GameState.Ended:
        this.gameService.setState(GameState.New);
        break;
      default:
        return;
    }
  }

  startGame() {
    this.gameService.setState(GameState.Started);
    this.gameStarted = true;
  }

  pauseGame() {
    this.inPause = true;
  }
}
