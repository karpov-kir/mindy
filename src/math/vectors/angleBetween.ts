import { convertRadiansToDegrees } from '../convertRadiansToDegrees';
import { dotProduct } from './dotProduct';
import { normalize } from './normalize';
import { Vector } from './Vector';

// https://habr.com/ru/post/131931/
export const angleBetween = (vectorA: Vector, vectorB: Vector): number => {
  return convertRadiansToDegrees(Math.acos(dotProduct(normalize(vectorA), normalize(vectorB))));
};
