// https://gist.github.com/Daniel-Hug/d7984d82b58d6d2679a087d896ca3d2b

import { Rectangle } from './Rectangle';

// Check if rectangle a touches rectangle b.
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
export function touches(rectangleA: Rectangle, rectangleB: Rectangle) {
  // Has horizontal gap
  if (rectangleA.start.x > rectangleB.end.x || rectangleB.start.x > rectangleA.end.x) {
    return false;
  }

  // Has vertical gap
  if (rectangleA.start.y > rectangleB.end.y || rectangleB.start.y > rectangleA.end.y) {
    return false;
  }

  return true;
}
