import {GameDirection} from './GameDirection';
import { GameService } from './game.service';
import { GameState } from './GameState';
import { OnInit } from '@angular/core';
import { Candy } from './Candy';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class Snake implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  private color = 'red';
   x = 0;
   y = 0;
   w = 20;
   h = 10;
   candy;
   currentDirection;
   rotated = false
  constructor(private ctx: CanvasRenderingContext2D, posX: number, posY: number,h: number,w: number, currentDirection: GameDirection, private gameService: GameService) {
    this.x = posX;
    this.y = posY;
    this.h = h;
    this.w =  w;
    this.generateCandy(ctx);
    this.currentDirection = currentDirection;

  }

  move(direction: GameDirection) {
    this.setPositionBasedOnDirection(direction);
      switch (direction) {
      case GameDirection.Up:
      this.moveUp();
      break;
      case GameDirection.Down:
      this.moveDown();
      break;
      case GameDirection.Left:
      this.moveLeft();
      break;
      case GameDirection.Right:
      this.moveRight();
      break;
      default:
      break;
    }
  }

  generateCandy(ctx: CanvasRenderingContext2D) {
    this.candy = new Candy(ctx)
    this.candy.x = this.generateCandyPosition(true)
    this.candy.y = this.generateCandyPosition(false)
  }

  generateCandyPosition(x: boolean): number {
    return  x ? Math.floor(Math.random() * (this.ctx.canvas.width - ( this.candy.w + this.x ) + 1) + this.x ) : Math.floor(Math.random() * (this.ctx.canvas.height - ( this.candy.h + this.y )  + 1) + this.y )
  }

  setPositionBasedOnDirection(direction: GameDirection)
  {
    if (direction === this.currentDirection){
      return
    }
    switch (this.currentDirection) {
      case GameDirection.Left:
      case GameDirection.Right:
        if (direction === GameDirection.Up || direction === GameDirection.Down ) {
          this.h = this.h ^ this.w;
          this.w = this.h ^ this.w;
          this.h = this.h ^ this.w;
        }
        break;
      case GameDirection.Up:
      case GameDirection.Down:
         if (direction === GameDirection.Left || direction === GameDirection.Right ) {
          this.h = this.h ^ this.w;
          this.w = this.h ^ this.w;
          this.h = this.h ^ this.w;
         }
         break;
      default:
        this.currentDirection = direction;
        return;
    }
    this.currentDirection = direction;
    this.rotated = this.w != 20;

  }

  moveRight() {
    this.x += 1;
    this.draw();
    this.checkForCollision()
  }

  moveLeft() {
    this.x -= 1;
    this.draw();
    this.checkForCollision()
  }

  moveDown() {
    this.y += 1;
    this.draw();
    this.checkForCollision()
  }

  moveUp() {
    this.y -= 1;
    this.draw();
    this.checkForCollision()
  }

  checkForCollision() {
    const x = {x1: this.x - 10, x2: this.x, y1: this.y - 10, y2: this.y}
    const y = {x1: this.candy.x - 10, x2: this.candy.x, y1: this.candy.y - 10, y2: this.candy.y}
    const cX = this.candy.x
    const cY = this.candy.y

    if (this.touches(x,y)) {
      this.candy.eated = true;
    }
    if (this.x >= this.ctx.canvas.width - this.w || this.x <= 0 || this.y >= this.ctx.canvas.height - this.h || this.y <= 0) {
      this.gameService.setState(GameState.Ended);
    }
  }


 touches(a, b) {
	// has horizontal gap
	if (a.x1 > b.x2 || b.x1 > a.x2) return false;

	// has vertical gap
	if (a.y1 > b.y2 || b.y1 > a.y2) return false;

	return true;
}

   draw() {
    this.ctx.fillStyle = this.color;
    // x, y, w, h
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    if (!this.candy.eated) {
      this.ctx.fillStyle = this.candy.color;
      this.ctx.fillRect(this.candy.x,this.candy.y,this.candy.w,this.candy.h)
    }

  }

}
