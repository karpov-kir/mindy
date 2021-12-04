import { Polygon } from '../polygon';
import { Vector } from '../vectors';
import { intersects } from './intersects';
import { isPointInside } from './isPointInside';

export class Rectangle {
  // Top left
  start: Vector;
  // Right bottom
  end: Vector;

  constructor(start = new Vector(), end = new Vector()) {
    this.start = start.clone();
    this.end = end.clone();
  }

  public toPolygon() {
    return new Polygon([
      this.start,
      new Vector({
        x: this.end.x,
        y: this.start.y,
      }),
      this.end,
      new Vector({
        x: this.start.x,
        y: this.end.y,
      }),
    ]);
  }

  public updateFrom(rectangle: Rectangle) {
    this.start.x = rectangle.start.x;
    this.start.y = rectangle.start.y;

    this.end.x = rectangle.end.x;
    this.end.y = rectangle.end.y;
  }

  public clone() {
    return new Rectangle(this.start, this.end);
  }

  public isPointInside(point: Vector) {
    return isPointInside(point, this);
  }

  public centralize() {
    const centralizeVector = new Vector({
      x: this.width / 2,
      y: this.height / 2,
    });

    this.start.substract(centralizeVector);
    this.end.substract(centralizeVector);

    return this;
  }

  public intersects(rectangleB: Rectangle) {
    return intersects(this, rectangleB);
  }

  public get width() {
    return Math.abs(this.end.x - this.start.x);
  }

  public get height() {
    return Math.abs(this.end.y - this.start.y);
  }

  public multiply(vector: Vector) {
    this.start.multiply(vector);
    this.end.multiply(vector);

    return this;
  }

  public add(vector: Vector) {
    this.start.add(vector);
    this.end.add(vector);

    return this;
  }

  public substract(vector: Vector) {
    this.start.substract(vector);
    this.end.substract(vector);

    return this;
  }

  public sort() {
    const a = this.start;
    const b = this.end;

    let topLeft: Vector | undefined;
    let topRight: Vector | undefined;
    let bottomLeft: Vector | undefined;
    let bottomRight: Vector | undefined;

    if (isFirstTopLeft(a, b)) {
      topLeft = a;
    } else if (isFirstTopLeft(b, a)) {
      topLeft = b;
    }

    if (isFirstBottomRight(a, b)) {
      bottomRight = a;
    } else if (isFirstBottomRight(b, a)) {
      bottomRight = b;
    }

    if (topLeft && bottomRight) {
      this.start = topLeft;
      this.end = bottomRight;
      return this;
    }

    if (isFirstTopRight(a, b)) {
      topRight = a;
    } else if (isFirstTopRight(b, a)) {
      topRight = b;
    }

    if (isFirstBottomLeft(a, b)) {
      bottomLeft = a;
    } else if (isFirstBottomLeft(b, a)) {
      bottomLeft = b;
    }

    if (!topLeft && topRight && bottomLeft) {
      topLeft = new Vector({
        x: bottomLeft.x,
        y: topRight.y,
      });
    }

    if (!bottomRight && topRight && bottomLeft) {
      bottomRight = new Vector({
        x: topRight.x,
        y: bottomLeft.y,
      });
    }

    if (!topLeft || !bottomRight) {
      return this;
    }

    this.start = topLeft;
    this.end = bottomRight;

    return this;
  }
}

function isFirstTopLeft(a: Vector, b: Vector) {
  return a.x < b.x && a.y < b.y;
}

function isFirstTopRight(a: Vector, b: Vector) {
  return a.x > b.x && a.y < b.y;
}

function isFirstBottomLeft(a: Vector, b: Vector) {
  return a.x < b.x && a.y > b.y;
}

function isFirstBottomRight(a: Vector, b: Vector) {
  return a.x > b.x && a.y > b.y;
}
