import * as defaults from "./constants";

type Pos = { x: number; y: number };

type Config = {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  POPULATION_SIZE: number;
  BEST_DOTS_COUNT: number;
  BEST_DOTS_DISPLAY_FRAMES: number;
  STEPS_PER_FRAME: number;
  DOT_RADIUS: number;
  startingPosition: Pos;
  finalPosition: Pos;
  DISTANCE: number;
  DNA_LENGTH: number;
  MAX_DNA_MUTATION: number;
};

const subscribers: Array<() => void> = [];

const state: Config = {
  CANVAS_WIDTH: (defaults as any).CANVAS_WIDTH,
  CANVAS_HEIGHT: (defaults as any).CANVAS_HEIGHT,
  POPULATION_SIZE: (defaults as any).POPULATION_SIZE,
  BEST_DOTS_COUNT: (defaults as any).BEST_DOTS_COUNT,
  BEST_DOTS_DISPLAY_FRAMES: (defaults as any).BEST_DOTS_DISPLAY_FRAMES,
  STEPS_PER_FRAME: (defaults as any).STEPS_PER_FRAME,
  DOT_RADIUS: (defaults as any).DOT_RADIUS,
  startingPosition: {
    ...((defaults as any).startingPosition || { x: 0, y: 0 }),
  },
  finalPosition: { ...((defaults as any).finalPosition || { x: 0, y: 0 }) },
  DISTANCE: 0,
  DNA_LENGTH: 0,
  MAX_DNA_MUTATION: 0,
};

function recomputeDerived() {
  state.DISTANCE =
    Math.abs(state.startingPosition.x - state.finalPosition.x) +
    Math.abs(state.startingPosition.y - state.finalPosition.y);
  state.DNA_LENGTH = Math.max(
    1,
    Math.floor(state.DISTANCE / state.STEPS_PER_FRAME),
  );
  state.MAX_DNA_MUTATION = Math.max(1, Math.floor(state.DNA_LENGTH / 10));
  state.BEST_DOTS_COUNT = Math.max(1, Math.floor(state.POPULATION_SIZE / 100));
}

recomputeDerived();

export const subscribe = (fn: () => void) => {
  subscribers.push(fn);
};

export const update = (patch: Partial<Config>) => {
  Object.assign(state, patch);
  recomputeDerived();
  subscribers.forEach((s) => s());
};

export default state;
