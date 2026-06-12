import config from "../config/runtimeConfig";
import { Vector2D } from "../math/Vector2D";

function getPossibleSteps() {
  const s = config.STEPS_PER_FRAME;
  return [
    new Vector2D(0, -s),
    new Vector2D(s, 0),
    new Vector2D(0, s),
    new Vector2D(-s, 0),
  ];
}

export class Dot {
  position: Vector2D;
  dna: Vector2D[];
  step: number;
  fitness: number;

  constructor(position: Vector2D, dna: Vector2D[] = []) {
    this.position = position;
    this.dna = dna;
    this.step = 0;
    this.fitness = 0;

    if (this.dna.length === 0) {
      const mexSteps = config.DNA_LENGTH;

      const possibleSteps = getPossibleSteps();
      const steps: Vector2D[] = Array.from(
        { length: mexSteps },
        () => possibleSteps[Math.floor(Math.random() * possibleSteps.length)],
      );
      this.dna = steps;
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      config.DOT_RADIUS,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  drawPath(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = config.DOT_RADIUS / 2;

    let tempPosition = new Vector2D(
      config.startingPosition.x,
      config.startingPosition.y,
    );

    for (let i = 0; i < this.dna.length; i++) {
      const step = this.dna[i];

      const startX = tempPosition.x;
      const startY = tempPosition.y;

      tempPosition.add(step);

      ctx.beginPath();

      // Different color for every segment
      ctx.strokeStyle = `hsl(${(i / this.dna.length) * 360}, 100%, 50%)`;

      ctx.moveTo(startX, startY);
      ctx.lineTo(tempPosition.x, tempPosition.y);

      ctx.stroke();
    }
  }

  move() {
    if (this.step < this.dna.length) {
      this.position.add(this.dna[this.step]);
      this.step++;
    }
  }
}
