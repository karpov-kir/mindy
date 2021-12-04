import { Vector } from '../vectors';
import { Rectangle } from './Rectangle';

export const isPointInside = (point: Vector, rectangle: Rectangle) => {
  if (point.x < rectangle.start.x || point.x > rectangle.end.x) {
    return false;
  }

  if (point.y < rectangle.start.y || point.y > rectangle.end.y) {
    return false;
  }

  return true;
};
