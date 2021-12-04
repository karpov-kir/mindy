import { Rectangle } from './Rectangle';
import { touches } from './touches';

export function intersects(
  rectangleA: Rectangle,
  rectangleB: Rectangle,
  mode: 'center' | 'cover' | 'touch' = 'touch',
): boolean {
  switch (mode) {
    case 'center': {
      throw new Error('Not implemented');
    }
    case 'cover': {
      throw new Error('Not implemented');
    }
    case 'touch': {
      return touches(rectangleA, rectangleB);
    }
    default:
      throw new Error('Not implemented');
  }
}
