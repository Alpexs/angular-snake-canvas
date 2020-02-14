import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { GameDirection } from '../GameDirection';
import { GameState } from '../GameState';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  gameStarted = false;
  selectedIndex = -1;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.selectedDirection.subscribe(direction => {
      this.selectedIndex = direction;
    });
    this.gameService.selectedState.subscribe(state => {
      if (state === GameState.Ended || state === GameState.New || state === GameState.Register) {
        this.selectedIndex = -1;
        this.gameService.selectedDirection.next(GameDirection.Right);
        this.gameStarted = false;
      } else {
        this.selectedIndex = 2;
        this.gameStarted = true;
      }
    });
  }

  updateSelection(x: number) {
    if (this.selectedIndex === x) {
      this.selectedIndex = -1;
      return;
    }
    this.selectedIndex = x;
    this.gameService.selectedDirection.next(x);
  }
}
