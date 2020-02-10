import { Injectable } from '@angular/core';
import { GameState } from './GameState';
import { Subject, BehaviorSubject } from 'rxjs';
import { GameDirection } from './GameDirection';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public score = 0;
  public selectedState: Subject<GameState> = new BehaviorSubject<GameState>(null);
  public selectedDirection: Subject<GameDirection> = new BehaviorSubject<GameDirection>(GameDirection.None);
  constructor() {
    this.selectedState.next(GameState.New);
  }

  setState(state: GameState) {
    this.selectedState.next(state);
  }

  setDirection(direction: GameDirection) {
    this.selectedDirection.next(direction);
  }
}
