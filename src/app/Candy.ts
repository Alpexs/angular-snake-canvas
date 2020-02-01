export class Candy {
x =  0;
y = 0;
w = 10;
h = 10;
color = 'green';
eated = false;

constructor(private ctx: CanvasRenderingContext2D) {}

draw() {
  this.ctx.fillStyle = this.color;
  this.ctx.fillRect(this.x, this.y, this.w, this.h);
}
}
