import { Vector } from './Vector';

// https://www.mathsisfun.com/algebra/vectors-dot-product.html
export const dotProduct = (vectorA: Vector, vectorB: Vector): number => {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
};
