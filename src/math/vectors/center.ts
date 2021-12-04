import { Vector } from './Vector';

export const center = (from: Vector, to: Vector): Vector => {
  const x = from.x + (to.x - from.x) / 2;
  const y = from.y + (to.y - from.y) / 2;

  return new Vector({ x, y });
};
