import { Vector } from './Vector';

export const add = (_vectorA: Vector, vectorB: Vector) => {
  const vectorA = _vectorA.clone();

  vectorA.x += vectorB.x;
  vectorA.y += vectorB.y;

  return vectorA;
};
