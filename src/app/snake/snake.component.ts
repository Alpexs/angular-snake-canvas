import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GameService } from '../game.service';
import { GameDirection } from '../GameDirection';
import { GameState } from '../GameState';
import {Snake} from './../Snake';
import { retry } from 'rxjs/operators';
import { EngineService } from '../engine.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {

  score;
  state;
  currentDirection = GameDirection.Right;
  constructor(private gameService: GameService, private ngZone: NgZone, private engineService: EngineService) {}
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  ngOnInit(): void {
    this.engineService.createScene(this.rendererCanvas);
    this.gameService.selectedState.subscribe(state => {
      this.state = state;
      if (state === GameState.Started) {
        this.engineService.animate();
        this.currentDirection = GameDirection.Right;
      }
      if (state === GameState.Ended) {
        this.engineService.ngOnDestroy();
      }
    });
    this.gameService.selectedDirection.subscribe(direction => {
      this.currentDirection = direction;
    });
    this.gameService.score.subscribe(score => {
      this.score = score;
    });
  }

  shouldShowScore(state: GameState): boolean {
    return this.state === state;
  }
}
