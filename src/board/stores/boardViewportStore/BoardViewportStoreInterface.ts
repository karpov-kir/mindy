import { Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';
import { CursorType } from '../../../rendering';

export type BoardViewportStoreInterface = {
  isMovingViewPort: boolean;
  cursorPosition: Vector;
  absoluteCursorPosition: Vector;
  zoomLevel: number;
  offset: Vector;
  cursorType: CursorType;
  selectedArea?: Rectangle;
  width: number;
  height: number;
  center: Vector;
  left: Vector;
  top: Vector;
  right: Vector;
  bottom: Vector;
};
