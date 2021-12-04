import { CursorEventCallback, ScrollData } from '../../../components';
import { BoxInterface } from '../../../entities';
import { Vector } from '../../../math/vectors';
import { DragData, DragStartData } from '../../../utils/dom';

export type BoardCursorInterface = {
  cursorOverBox?: BoxInterface;
  previousCursorOverBox?: BoxInterface;
  position: Vector;
  absolutePosition: Vector;

  onMove: (callback: CursorEventCallback) => void;
  onDown: (callback: CursorEventCallback) => void;
  onTap: (callback: CursorEventCallback) => void;
  onDoubleTap: (callback: CursorEventCallback) => void;
  onDragStart: (callback: CursorEventCallback<[DragStartData]>) => void;
  onDrag: (callback: CursorEventCallback<[DragData]>) => void;
  onUp: (callback: CursorEventCallback<[DragData]>) => void;
  onScroll: (callback: CursorEventCallback<[ScrollData]>) => void;
  syncCursorWithStore: () => void;
};
