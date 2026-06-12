# Smart Dots

A visual, browser-based simulation of an evolutionary pathfinding system built with TypeScript and Vite.

## Overview

`Smart Dots` shows a population of dots learning to reach a target location through a simple genetic algorithm. Each dot is controlled by a fixed-length DNA sequence of movement vectors, and the simulation evolves the population across generations to improve fitness.

## Features

- Interactive HTML5 canvas simulation
- Live control panel to adjust configuration values
- Sliders for animation speed, dot radius, mutation amount, and display length
- Inputs for canvas size, population size, start/end positions, and mutation settings
- Randomize start/end positions with a single button
- Visualization of the best dot path each generation
- Automatic generation cycling and fitness evaluation
- Clean, modern UI styling consistent with the app theme

## Math & Logic

### Movement model

- Each dot stores a `dna` array of `Vector2D` steps.
- Each step is one of four cardinal directions:
  - up: `(0, -stepsPerFrame)`
  - right: `(stepsPerFrame, 0)`
  - down: `(0, stepsPerFrame)`
  - left: `(-stepsPerFrame, 0)`
- The dot position updates by adding the current DNA step at each frame.

### DNA length

- The DNA length is derived from the Manhattan distance between the start and finish positions:
  - `DISTANCE = |start.x - finish.x| + |start.y - finish.y|`
  - `DNA_LENGTH = max(1, floor(DISTANCE / STEPS_PER_FRAME))`
- This ensures each dot has enough actions to reasonably reach the goal.

### Fitness evaluation

- A dot's fitness is computed after it finishes all DNA steps.
- Fitness uses the inverse of the remaining Manhattan distance to the target:
  - `fitness = DNA_LENGTH * STEPS_PER_FRAME - distanceToFinish`
- Higher fitness means the dot ended closer to the target.

### Evolution strategy

- Each generation evaluates all dots and sorts them by fitness.
- The top subset of dots becomes the parent pool for the next generation.
- New dots inherit a full parent DNA sequence.
- Random mutations are applied within the DNA to introduce variation.
- Mutation amount is governed by `MAX_DNA_MUTATION`.

## Project structure

- `index.html` — application shell and canvas container
- `src/main.ts` — simulation entry point and animation loop
- `src/config/runtimeConfig.ts` — live config state and update system
- `src/entities/Dot.ts` — dot behavior, drawing, and DNA initialization
- `src/entities/Target.ts` — rendering of the finish target
- `src/evolution/ Population.ts` — generation, fitness, and reproduction logic
- `src/ui/Hud.ts` — control panel UI and form handling
- `src/style.css` — visual theme, HUD styling, and layout

## Getting started

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local URL shown by Vite.

## How to use

1. Open the app in the browser.
2. Use the HUD controls to configure:
   - canvas size
   - population size
   - steps per frame
   - dot radius
   - mutation rate
   - start and finish coordinates
3. Click `Apply` to rebuild the simulation with new values.
4. Click `Randomize positions` to move the start and finish to new locations.
5. Watch the best dot path animate as the population evolves.

## Notes

- The simulation continues even after a best solution is found, but the `solutionFound` state preserves the best path shown.
- Reconfiguring the simulation resets the generation count and restarts the population.

## License

This project is open to modification and experimentation. Feel free to adapt the genetic logic, visualization, and controls to your own pathfinding experiments.
