import { Vector } from './Vector';

export const magnitude = ({ x, y }: Vector) => {
  return Math.sqrt(x * x + y * y);
};
