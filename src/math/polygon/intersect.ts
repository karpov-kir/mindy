import { Polygon } from './Polygon';
import { touches } from './touches';

export function intersects(
  polygonA: Polygon,
  polygonB: Polygon,
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
      return touches(polygonA, polygonB);
    }
    default:
      throw new Error('Not implemented');
  }
}
