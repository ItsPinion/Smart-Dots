export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;
export const POPULATION_SIZE = 1000;
export const BEST_DOTS_COUNT = POPULATION_SIZE / 100;
export const BEST_DOTS_DISPLAY_FRAMES = 60;
export const STEPS_PER_FRAME = 1;
export const DOT_RADIUS = 10;
export const startingPosition = {
  x: 0 || getRandomMultiple(0, CANVAS_WIDTH, STEPS_PER_FRAME),
  y: 0 || getRandomMultiple(0, CANVAS_HEIGHT, STEPS_PER_FRAME),
};
export const finalPosition = {
  x: 0 || getRandomMultiple(0, CANVAS_WIDTH, STEPS_PER_FRAME),
  y: 0 || getRandomMultiple(0, CANVAS_HEIGHT, STEPS_PER_FRAME),
};
export const DISTANCE =
  Math.abs(startingPosition.x - finalPosition.x) +
  Math.abs(startingPosition.y - finalPosition.y);
console.log(DISTANCE);
export const DNA_LENGTH = DISTANCE / STEPS_PER_FRAME;
export const MAX_DNA_MUTATION = DNA_LENGTH / 10;

export function getRandomMultiple(min: number, max: number, divisor: number): number {
  const firstMultiple = Math.ceil(min / divisor) * divisor;
  const lastMultiple = Math.floor(max / divisor) * divisor;

  const count = (lastMultiple - firstMultiple) / divisor + 1;

  const index = Math.floor(Math.random() * count);

  return firstMultiple + index * divisor;
}
