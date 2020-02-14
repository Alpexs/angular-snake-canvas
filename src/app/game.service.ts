import { Injectable } from '@angular/core';
import { GameState } from './GameState';
import { Subject, BehaviorSubject } from 'rxjs';
import { GameDirection } from './GameDirection';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public score: Subject<number> = new BehaviorSubject<number>(0);
  players: Player[] = [];
  private currentPlayer;
  public selectedState: Subject<GameState> = new BehaviorSubject<GameState>(null);
  public selectedDirection: Subject<GameDirection> = new BehaviorSubject<GameDirection>(GameDirection.None);
  constructor() {
    this.selectedState.next(GameState.New);
    this.players = this.getPlayersSortedByRanking();
  }

  setScore(score: number) {
    this.score.next(score);
  }

  setState(state: GameState) {
    this.selectedState.next(state);
  }

  setDirection(direction: GameDirection) {
    this.selectedDirection.next(direction);
  }

  getMyProfile(): Player {
    this.currentPlayer =  JSON.parse(localStorage.getItem('myPlayer'));
    return this.currentPlayer;
  }

  getPlayersSortedByRanking(): Player[] {
    this.players = JSON.parse(localStorage.getItem('players')) || [] ;
    if (this.players) {
      return this.players.sort((a, b) => a.score - b.score);
    } else {
      return [];
    }
  }

  clearPlayers() {
    localStorage.setItem('players', JSON.stringify([]));
  }
  clearMyPlayer() {
    localStorage.setItem('myPlayer', JSON.stringify((null)));
  }

  updateCurrentPlayerHighScore(score: number) {
    if (this.currentPlayer.score > score) {
      return;
    }
    this.currentPlayer.score = score;
    this.players.find(i => i.id === this.currentPlayer.id).score = score;
    localStorage.setItem('myPlayer', JSON.stringify((this.currentPlayer)));
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  setPlayer(player: Player) {
    let lastID = 0;
    if (this.players) {
      lastID = Math.max(...this.players.map(val => val.id), 0);
    }
    player.id = lastID + 1;
    this.players.push(player);
    localStorage.setItem('players', JSON.stringify(this.players));
    localStorage.setItem('myPlayer', JSON.stringify(player));
    this.setState(GameState.New);
  }
}
