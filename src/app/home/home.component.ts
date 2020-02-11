import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { GameState } from '../GameState';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Player } from '../player';

@Component({
  selector: 'app-home-registration',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  playerForm = this.formBuilder.group({
    username: ['', Validators.required],
    age: [0, Validators.required]
  });
  constructor(private gameService: GameService, private formBuilder: FormBuilder) {

    if (gameService.getMyProfile()) {
      gameService.setState(GameState.New);
    } else {
      gameService.setState(GameState.Register);
    }
  }

  addPlayer() {
    const player = new Player();
    player.name = this.playerForm.value.username;
    player.age = this.playerForm.value.age;
    this.gameService.setPlayer(player);
  }


}
