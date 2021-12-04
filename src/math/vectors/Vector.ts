import { add } from './add';
import { center } from './center';
import { devide } from './devide';
import { dotProduct } from './dotProduct';
import { magnitude } from './magnitude';
import { multiply } from './multiply';
import { normalize } from './normalize';
import { subtract } from './subtract';

type Coordinates = {
  x: number;
  y: number;
};

export class Vector {
  x: number;
  y: number;

  constructor(
    coordinates: Coordinates = {
      x: 0,
      y: 0,
    },
  ) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  public clone() {
    return new Vector(this);
  }

  public updateFrom(vector: Vector) {
    this.x = vector.x;
    this.y = vector.y;
  }

  public substract(vectorB: Vector) {
    const subtracted = subtract(this, vectorB);

    this.x = subtracted.x;
    this.y = subtracted.y;

    return this;
  }

  public add(vectorB: Vector) {
    const added = add(this, vectorB);

    this.x = added.x;
    this.y = added.y;

    return this;
  }

  public multiply(vectorB: Vector) {
    const multiplied = multiply(this, vectorB);

    this.x = multiplied.x;
    this.y = multiplied.y;

    return this;
  }

  public devide(vectorB: Vector) {
    const devided = devide(this, vectorB);

    this.x = devided.x;
    this.y = devided.y;

    return this;
  }

  public normalize() {
    const normalized = normalize(this);

    this.x = normalized.x;
    this.y = normalized.y;

    return this;
  }

  public dotProduct(vectorB: Vector) {
    return dotProduct(this, vectorB);
  }

  public center(to: Vector) {
    return center(this, to);
  }

  public magnitude() {
    return magnitude(this);
  }

  public toString(limited = true) {
    const x = limited ? this.x.toFixed(1) : this.x;
    const y = limited ? this.y.toFixed(1) : this.y;

    return `${x}:${y}`;
  }
}
