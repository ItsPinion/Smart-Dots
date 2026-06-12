import config from "../config/runtimeConfig";
import { Dot } from "../entities/Dot";
import { Target } from "../entities/Target";
import { Vector2D } from "../math/Vector2D";

export function getFinish() {
  return new Target(config.finalPosition.x, config.finalPosition.y);
}

export class Population {
  dots: Dot[];
  generation: number;
  steps: number;

  constructor(dots: Dot[]) {
    this.dots = dots;
    this.generation = 0;
    this.steps = 0;
  }

  update() {
    if (!this.isGenerationFinished()) {
      this.dots.forEach((dot) => {
        dot.move();
      });
      this.steps++;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    this.dots.forEach((dot) => {
      dot.draw(ctx, "#ff000020");
    });
  }

  isGenerationFinished() {
    return this.dots.every((dot) => dot.step >= dot.dna.length);
  }

  evaluateFitness() {
    if (this.isGenerationFinished()) {
      const finish = getFinish();
      for (const dot of this.dots) {
        dot.fitness =
          config.DNA_LENGTH * config.STEPS_PER_FRAME -
          dot.position.distance(finish);
      }
    }
  }

  getBestDots() {
    if (!this.isGenerationFinished()) return;
    this.dots.sort((a, b) => b.fitness - a.fitness);
    return this.dots.slice(0, config.BEST_DOTS_COUNT);
  }

  getRandomMovement() {
    const s = config.STEPS_PER_FRAME;
    const possibleSteps = [
      new Vector2D(0, -s),
      new Vector2D(s, 0),
      new Vector2D(0, s),
      new Vector2D(-s, 0),
    ];

    return possibleSteps[Math.floor(Math.random() * possibleSteps.length)];
  }

  nextGeneration(bestDots: Dot[]) {
    if (!this.isGenerationFinished()) return;
    this.generation++;
    this.steps = 0;

    this.dots = this.dots.map((_, i) => {
      const parentDNA = [
        ...bestDots[Math.floor(Math.random() * bestDots.length)].dna,
      ];

      for (let j = 0; j < i % config.MAX_DNA_MUTATION; j++) {
        parentDNA[Math.floor(Math.random() * parentDNA.length)] =
          this.getRandomMovement();
      }

      return new Dot(
        new Vector2D(config.startingPosition.x, config.startingPosition.y),
        parentDNA,
      );
    });
  }
}
