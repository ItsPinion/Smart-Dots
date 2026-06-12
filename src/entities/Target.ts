import config from "../config/runtimeConfig";
import { Vector2D } from "../math/Vector2D";

export class Target extends Vector2D {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#00ff00";
    ctx.beginPath();
    ctx.arc(this.x, this.y, config.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
