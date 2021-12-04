// https://gist.github.com/Daniel-Hug/d7984d82b58d6d2679a087d896ca3d2b

import { Rectangle } from './Rectangle';

// Check if rectangle a contains rectangle b.
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
export function contains(a: Rectangle, b: Rectangle): boolean {
  return !(b.start.x < a.start.x || b.start.y < a.start.y || b.end.x > a.end.x || b.end.y > a.end.y);
}
