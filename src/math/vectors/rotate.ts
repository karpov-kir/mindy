import { Vector } from './Vector';

// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
export const rotate = (_originVector: Vector, pointVector: Vector, angle: number, anticlockwise = false): Vector => {
  const originVector = _originVector.clone();

  if (angle == 0) {
    originVector.x = pointVector.x;
    originVector.y = pointVector.y;

    return originVector;
  }

  let radians: number;

  if (anticlockwise) {
    radians = (Math.PI / 180) * angle;
  } else {
    radians = (Math.PI / -180) * angle;
  }

  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  originVector.x = cos * (pointVector.x - originVector.x) + sin * (pointVector.y - originVector.y) + originVector.x;
  originVector.y = cos * (pointVector.y - originVector.y) - sin * (pointVector.x - originVector.x) + originVector.y;

  return originVector;
};
