// https://gist.github.com/Daniel-Hug/d7984d82b58d6d2679a087d896ca3d2b

import { Rectangle } from './Rectangle';

// Check if rectangle a overlaps rectangle b.
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
export function overlaps(a: Rectangle, b: Rectangle): boolean {
  // No horizontal overlap
  if (a.start.x >= b.end.x || b.start.x >= a.end.x) {
    return false;
  }

  // No vertical overlap
  if (a.start.y >= b.end.y || b.start.y >= a.end.y) {
    return false;
  }

  return true;
}
