import "./style.css";
import config, { subscribe } from "./config/runtimeConfig";
import { Vector2D } from "./math/Vector2D";
import { Dot } from "./entities/Dot";
import { getFinish, Population } from "./evolution/ Population";
import Hud from "./ui/Hud";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const generationEl = document.getElementById("generation") as HTMLElement;
const stepsEl = document.getElementById("steps") as HTMLElement;
const bestFitnessEl = document.getElementById("best-fitness") as HTMLElement;
const bestDistanceEl = document.getElementById("best-distance") as HTMLElement;

canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;

function createPopulation() {
  return new Population(
    Array.from(
      { length: config.POPULATION_SIZE },
      (_) =>
        new Dot(
          new Vector2D(config.startingPosition.x, config.startingPosition.y),
        ),
    ),
  );
}

let population = createPopulation();
let bestDotsToShow: Dot[] | null = null;
let bestDotsDisplayTimer = 0;
let solutionFound = false;

new Hud(document.body);

subscribe(() => {
  // rebuild canvas and population on config changes
  canvas.width = config.CANVAS_WIDTH;
  canvas.height = config.CANVAS_HEIGHT;
  population = createPopulation();
  bestDotsToShow = null;
  solutionFound = false;
  generationEl.textContent = `Generation ${population.generation}`;
});

function loop() {
  population.update();
  population.draw(ctx);
  getFinish().draw(ctx);
  population.evaluateFitness();

  if (!bestDotsToShow && !solutionFound) {
    const bestDots = population.getBestDots();
    if (bestDots) {
      bestDotsToShow = bestDots;
      bestDotsDisplayTimer = config.BEST_DOTS_DISPLAY_FRAMES;
    }
  }

  if (bestDotsToShow) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bestDotsToShow.forEach((dot) => {
      dot.draw(ctx, "#0000ff99");
    });
    const bestDot = bestDotsToShow[0];
    getFinish().draw(ctx);
    bestDot.drawPath(ctx);
    bestDot.draw(ctx, "#ffff00");
    if (bestDotsDisplayTimer > 0) {
      bestDotsDisplayTimer -= 1;
    } else {
      console.log("Generation:", population.generation);
      console.log("bestDot.fitness:", bestDot.fitness);
      console.log("bestDot.distance:", bestDot.position.distance(getFinish()));

      bestFitnessEl.textContent = `${Math.floor(bestDot.fitness)}`;
      bestDistanceEl.textContent = `${Math.floor(bestDot.position.distance(getFinish()))}`;

      if (bestDot.fitness >= config.DISTANCE) {
        console.log("bestDot.dna:", bestDot.dna);
        solutionFound = true;
        bestDotsToShow = [bestDot];
      } else {
        population.nextGeneration(bestDotsToShow);
        generationEl.textContent = `${population.generation}`;
        bestDotsToShow = null;
      }
    }
  }

  stepsEl.textContent = `${population.steps}`;
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
