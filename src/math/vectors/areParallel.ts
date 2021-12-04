import { Vector } from './Vector';

// http://problemsphysics.com/vectors/parallel_perpend_vectors.html
export const areParallel = (vectorA: Vector, vectorB: Vector): boolean => {
  return vectorA.x * vectorB.y === vectorB.x * vectorA.y;
};
