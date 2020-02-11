import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  players;
  constructor(private gameService: GameService) {
    if (gameService.getPlayersSortedByRanking()) {
      this.players  = gameService.getPlayersSortedByRanking();
    } else {
      this.players = [];
    }
}

  ngOnInit() {
  }

}
