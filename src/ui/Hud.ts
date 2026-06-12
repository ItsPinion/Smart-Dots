import config, { update, subscribe } from "../config/runtimeConfig";

type HudField = {
  label: string;
  name: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
  suffix?: string;
};

export default class Hud {
  container: HTMLElement;
  form: HTMLFormElement;

  constructor(parent: ParentNode = document.body) {
    this.container = document.createElement("div");
    this.container.className = "hud-panel";

    this.form = document.createElement("form");
    this.form.className = "hud-form";

    this.build();

    this.container.appendChild(this.form);
    parent.appendChild(this.container);

    subscribe(() => this.refresh());
  }

  build() {
    this.form.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Simulation Controls";
    this.form.appendChild(title);

    const rows: HudField[][] = [
      [
        {
          label: "Canvas width",
          name: "CANVAS_WIDTH",
          value: config.CANVAS_WIDTH,
          min: 300,
          max: 1200,
          step: 50,
        },
        {
          label: "Canvas height",
          name: "CANVAS_HEIGHT",
          value: config.CANVAS_HEIGHT,
          min: 300,
          max: 1200,
          step: 50,
        },
      ],
      [
        {
          label: "Population size",
          name: "POPULATION_SIZE",
          value: config.POPULATION_SIZE,
          min: 100,
          max: 2000,
          step: 50,
        },
      ],
      [
        {
          label: "Steps per frame",
          name: "STEPS_PER_FRAME",
          value: config.STEPS_PER_FRAME,
          min: 1,
          max: 20,
          step: 1,
          slider: true,
        },
        {
          label: "Dot radius",
          name: "DOT_RADIUS",
          value: config.DOT_RADIUS,
          min: 1,
          max: 20,
          step: 1,
          slider: true,
        },
      ],
      [
        {
          label: "Max mutations",
          name: "MAX_DNA_MUTATION",
          value: config.MAX_DNA_MUTATION,
          min: 1,
          max: 50,
          step: 1,
          slider: true,
        },
        {
          label: "Display frames",
          name: "BEST_DOTS_DISPLAY_FRAMES",
          value: config.BEST_DOTS_DISPLAY_FRAMES,
          min: 1,
          max: 120,
          step: 1,
          slider: true,
        },
      ],
      [
        {
          label: "Start X",
          name: "START_X",
          value: config.startingPosition.x,
          min: 0,
          max: config.CANVAS_WIDTH,
          step: config.STEPS_PER_FRAME || 1,
        },
        {
          label: "Start Y",
          name: "START_Y",
          value: config.startingPosition.y,
          min: 0,
          max: config.CANVAS_HEIGHT,
          step: config.STEPS_PER_FRAME || 1,
        },
      ],
      [
        {
          label: "Final X",
          name: "FINAL_X",
          value: config.finalPosition.x,
          min: 0,
          max: config.CANVAS_WIDTH,
          step: config.STEPS_PER_FRAME || 1,
        },
        {
          label: "Final Y",
          name: "FINAL_Y",
          value: config.finalPosition.y,
          min: 0,
          max: config.CANVAS_HEIGHT,
          step: config.STEPS_PER_FRAME || 1,
        },
      ],
    ];

    for (const row of rows) {
      const rowWrapper = document.createElement("div");
      rowWrapper.className = "hud-field-row-group";

      for (const field of row) {
        const wrapper = document.createElement("div");
        wrapper.className = "hud-field";

        const label = document.createElement("label");
        label.className = "hud-label";
        label.textContent = field.label;
        label.htmlFor = field.name;

        const controls = document.createElement("div");
        controls.className = "hud-field-row";

        const numberInput = document.createElement("input");
        numberInput.className = "hud-input hud-number";
        numberInput.name = field.name;
        numberInput.id = field.name;
        numberInput.type = "number";
        numberInput.value = String(field.value);
        if (field.min !== undefined) numberInput.min = String(field.min);
        if (field.max !== undefined) numberInput.max = String(field.max);
        if (field.step !== undefined) numberInput.step = String(field.step);

        controls.appendChild(numberInput);

        if (field.slider) {
          const rangeInput = document.createElement("input");
          rangeInput.className = "hud-input hud-range";
          rangeInput.name = `${field.name}_RANGE`;
          rangeInput.type = "range";
          rangeInput.value = String(field.value);
          if (field.min !== undefined) rangeInput.min = String(field.min);
          if (field.max !== undefined) rangeInput.max = String(field.max);
          if (field.step !== undefined) rangeInput.step = String(field.step);

          rangeInput.addEventListener("input", () => {
            numberInput.value = rangeInput.value;
          });

          numberInput.addEventListener("input", () => {
            rangeInput.value = numberInput.value;
          });

          controls.appendChild(rangeInput);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(controls);
        rowWrapper.appendChild(wrapper);
      }

      this.form.appendChild(rowWrapper);
    }

    const buttonRow = document.createElement("div");
    buttonRow.className = "hud-actions";

    const apply = document.createElement("button");
    apply.type = "button";
    apply.className = "hud-button";
    apply.textContent = "Apply";
    apply.onclick = () => this.apply();

    const randomize = document.createElement("button");
    randomize.type = "button";
    randomize.className = "hud-button hud-secondary";
    randomize.textContent = "Randomize positions";
    randomize.onclick = () => this.randomizePositions();

    buttonRow.appendChild(apply);
    buttonRow.appendChild(randomize);
    this.form.appendChild(buttonRow);
  }

  refresh() {
    const values = {
      CANVAS_WIDTH: config.CANVAS_WIDTH,
      CANVAS_HEIGHT: config.CANVAS_HEIGHT,
      POPULATION_SIZE: config.POPULATION_SIZE,
      STEPS_PER_FRAME: config.STEPS_PER_FRAME,
      DOT_RADIUS: config.DOT_RADIUS,
      MAX_DNA_MUTATION: config.MAX_DNA_MUTATION,
      BEST_DOTS_DISPLAY_FRAMES: config.BEST_DOTS_DISPLAY_FRAMES,
      START_X: config.startingPosition.x,
      START_Y: config.startingPosition.y,
      FINAL_X: config.finalPosition.x,
      FINAL_Y: config.finalPosition.y,
    };

    for (const [name, value] of Object.entries(values)) {
      const numberInput = this.form.querySelector(
        `input[name=${name}]`,
      ) as HTMLInputElement | null;
      if (numberInput) numberInput.value = String(value);
      const rangeInput = this.form.querySelector(
        `input[name=${name}_RANGE]`,
      ) as HTMLInputElement | null;
      if (rangeInput) rangeInput.value = String(value);
    }
  }

  apply() {
    const getValue = (name: string) => {
      const input = this.form.querySelector(
        `input[name=${name}]`,
      ) as HTMLInputElement | null;
      return input ? Number(input.value) : 0;
    };

    const patch: any = {
      CANVAS_WIDTH: getValue("CANVAS_WIDTH"),
      CANVAS_HEIGHT: getValue("CANVAS_HEIGHT"),
      POPULATION_SIZE: getValue("POPULATION_SIZE"),
      STEPS_PER_FRAME: getValue("STEPS_PER_FRAME"),
      DOT_RADIUS: getValue("DOT_RADIUS"),
      MAX_DNA_MUTATION: getValue("MAX_DNA_MUTATION"),
      BEST_DOTS_DISPLAY_FRAMES: getValue("BEST_DOTS_DISPLAY_FRAMES"),
      startingPosition: {
        x: getValue("START_X"),
        y: getValue("START_Y"),
      },
      finalPosition: {
        x: getValue("FINAL_X"),
        y: getValue("FINAL_Y"),
      },
    };

    update(patch);
  }

  randomizePositions() {
    const w = config.CANVAS_WIDTH;
    const h = config.CANVAS_HEIGHT;
    const s = Math.max(1, config.STEPS_PER_FRAME);

    const randMultiple = (max: number) =>
      Math.floor(Math.random() * Math.floor(max / s)) * s;

    update({
      startingPosition: { x: randMultiple(w), y: randMultiple(h) },
      finalPosition: { x: randMultiple(w), y: randMultiple(h) },
    });
  }
}
