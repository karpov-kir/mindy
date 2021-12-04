import { DimensionsRectangle, Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';

export type PointCoordinatesOptions = {
  position: Vector;
  zoomable?: boolean;
};

export type DebugDrawerInterface = {
  colorBoard: () => void;
  pointCoordinates: (options: PointCoordinatesOptions) => void;
  rectangleCoordinates: (rectangle: DimensionsRectangle | Rectangle) => void;
  cursorCoordinates: () => void;
  selectedAreaCoordinates: () => void;
  centerGuides: () => void;
};
