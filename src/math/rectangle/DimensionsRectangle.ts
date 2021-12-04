import { Vector } from '../vectors';
import { Rectangle } from './Rectangle';

export class DimensionsRectangle {
  position: Vector;
  width: number;
  height: number;

  constructor(position = new Vector(), width = 100, height = 50) {
    this.position = position;
    this.height = height;
    this.width = width;
  }

  public toRectangle() {
    return new Rectangle(
      this.position,
      new Vector({
        x: this.position.x + this.width,
        y: this.position.y + this.height,
      }),
    );
  }
}
