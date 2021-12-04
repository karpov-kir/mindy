import { Vector } from '../../math/vectors';
import { DragData, DragStartData } from '../../utils/dom';

export type ScrollData = {
  delta: Vector;
};

export type CursorEventCallback<AdditionalArgs extends Array<unknown> = []> = (
  event: MouseEvent,
  position: Vector,
  ...args: AdditionalArgs
) => void;

export type CursorInterface = {
  position: Vector;
  containerElement: HTMLElement;

  onDown: (callback: CursorEventCallback) => void;
  onTap: (callback: CursorEventCallback) => void;
  onDoubleTap: (callback: CursorEventCallback) => void;
  onMove: (callback: CursorEventCallback) => void;
  onDragStart: (callback: CursorEventCallback<[DragStartData]>) => void;
  onDrag: (callback: CursorEventCallback<[DragData]>) => void;
  onDragEnd: (callback: CursorEventCallback<[DragData]>) => void;
  onUp: (callback: CursorEventCallback<[DragData]>) => void;
  onScroll: (callback: CursorEventCallback<[ScrollData]>) => void;
};
