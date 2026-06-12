export class Vector2D {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2D) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  subtract(v: Vector2D) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(scalar: number) {
    if (scalar === 0) return this;

    this.x /= scalar;
    this.y /= scalar;

    return this;
  }

  distance(v: Vector2D) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }
}
