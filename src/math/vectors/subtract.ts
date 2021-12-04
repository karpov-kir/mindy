import { Vector } from './Vector';

export const subtract = (_vectorA: Vector, vectorB: Vector): Vector => {
  const vectorA = _vectorA.clone();

  vectorA.x -= vectorB.x;
  vectorA.y -= vectorB.y;

  return vectorA;
};
