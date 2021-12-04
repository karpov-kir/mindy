import { magnitude } from './magnitude';
import { Vector } from './Vector';

export const normalize = (_vector: Vector): Vector => {
  const vector = _vector.clone();
  const vectorMagnitude = magnitude(vector);

  vector.x /= vectorMagnitude;
  vector.y /= vectorMagnitude;

  return vector;
};
