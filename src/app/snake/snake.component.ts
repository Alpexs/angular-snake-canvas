import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GameService } from '../game.service';
import { GameDirection } from '../GameDirection';
import { GameState } from '../GameState';
import {Snake} from './../Snake';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {

  currentDirection = GameDirection.Right;
  snakes: Snake[] = [];

  constructor(private gameService: GameService, private ngZone: NgZone) { }
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.gameService.selectedState.subscribe(state => {
      if (state === GameState.Started) {
        this.newGame();
        this.currentDirection = GameDirection.Right;
      }
      if (state === GameState.Ended) {
        clearInterval(this.interval);
        cancelAnimationFrame(this.requestId);
        this.ctx.clearRect(0, 0 , this.ctx.canvas.width, this.ctx.canvas.height);
        this.snakes = [];
      }
    });
    this.gameService.selectedDirection.subscribe(direction => {
      this.currentDirection = direction;
    });
  }

  newGame() {
    this.setSnake();
    this.ngZone.runOutsideAngular(() => this.tick());
    this.interval = setInterval(() => {
      this.tick();
    }, 20);
  }
  setSnake() {
    const posX = this.ctx.canvas.width / 2 - 20;
    const posY = this.ctx.canvas.height / 2 - 20;
    const square = new Snake(this.ctx, posX, posY, 10, 20, GameDirection.Right, this.gameService);
    this.ctx.clearRect(0, 0 , this.ctx.canvas.width, this.ctx.canvas.height);
    square.draw();
    this.snakes = this.snakes.concat(square);

  }
  addSnake() {
    let w = this.snakes[0].w;
    let h = this.snakes[0].h;
    const posX = this.snakes[0].x;
    const posY = this.snakes[0].y;
    const direction = this.snakes[0].currentDirection;
    if (!this.snakes[0].rotated) {
      w += 10;
    } else {
      h += 10;
    }
    const square = new Snake(this.ctx, posX, posY, h, w, direction, this.gameService);
    this.snakes.splice(0, 0, square);
    square.draw();
  }
  tick() {
    this.ctx.clearRect(0, 0 , this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.snakes[0].candy.eated) {
      this.currentDirection = this.snakes[0].currentDirection;
      this.addSnake();
    }
    this.snakes.forEach((square: Snake) => {
      square.move(this.currentDirection);
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }
}
