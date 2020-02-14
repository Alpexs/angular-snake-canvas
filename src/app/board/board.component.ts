import { Component, OnInit } from '@angular/core';
import { GameState } from '../GameState';
import { GameService } from '../game.service';
import { Player } from '../player';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  state: GameState;
  currentPlayer: Player;
  inPause: boolean;
  gameStarted: boolean;
  currentTimer = 0;
  audio;
  constructor(private gameService: GameService) {
    if (gameService.getMyProfile()) {
      this.currentPlayer = gameService.getMyProfile();
    } else {
      this.updateState(GameState.Register);
    }
  }

  ngOnInit() {
    // tslint:disable-next-line: deprecation
    this.gameService.selectedState.subscribe(state => {
      this.updateState(state);
    });
  }
  playSound() {
    this.audio = new Audio();
    this.audio.src = '../../assets/introfamenor.mp3';
    this.audio.load();
    this.audio.play();
    }

    stopSound() {
      this.audio.pause();
      this.audio.currentTimer = 0;
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
        this.playSound();
        break;
      case GameState.Ended:
        this.stopSound();
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
