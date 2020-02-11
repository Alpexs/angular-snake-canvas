import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-game-app';
  canPlay = false;
  constructor(private gameService: GameService) {
    if (this.gameService.getMyProfile()) {
      this.canPlay = true;
    }
  }
}
