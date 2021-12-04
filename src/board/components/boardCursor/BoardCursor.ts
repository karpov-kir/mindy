import { CursorEventCallback, CursorInterface, ScrollData } from '../../../components';
import { BoxInterface } from '../../../entities';
import { Vector } from '../../../math/vectors';
import { DragData, DragStartData } from '../../../utils/dom';
import { BoardViewportStoreInterface } from '../../stores';
import { BoardCursorInterface } from './BoardCursorInterface';

type BoardCursorDependencies = {
  cursor: CursorInterface;
  getBoxByPosition: (position: Vector, zoomLevel: number) => BoxInterface | undefined;
  boardViewportStore: BoardViewportStoreInterface;
};

export class BoardCursor implements BoardCursorInterface {
  private d: BoardCursorDependencies;

  public cursorOverBox?: BoxInterface;
  public previousCursorOverBox?: BoxInterface;

  private _position: Vector;

  public get position() {
    this._position.updateFrom(this.absolutePosition.clone().substract(this.d.boardViewportStore.offset));

    return this._position;
  }

  public get absolutePosition() {
    return this.d.cursor.position;
  }

  constructor(d: BoardCursorDependencies) {
    this.d = d;

    this._position = this.d.cursor.position.clone();

    this.d.cursor.onMove(() => this.syncCursorWithStore());
    this.d.cursor.onDragStart(() => this.handleDragStart());

    // Share to drawers. It's updated automatically.
    this.d.boardViewportStore.cursorPosition = this.position;
    this.d.boardViewportStore.absoluteCursorPosition = this.absolutePosition;
  }

  public onMove(callback: CursorEventCallback) {
    this.d.cursor.onMove(callback);
  }

  public onDown(callback: CursorEventCallback) {
    this.d.cursor.onDown(callback);
  }

  public onTap(callback: CursorEventCallback) {
    this.d.cursor.onTap(callback);
  }

  public onDoubleTap(callback: CursorEventCallback) {
    this.d.cursor.onDoubleTap(callback);
  }

  public onDragStart(callback: CursorEventCallback<[DragStartData]>) {
    this.d.cursor.onDragStart(callback);
  }

  public onDrag(callback: CursorEventCallback<[DragData]>) {
    this.d.cursor.onDrag(callback);
  }

  public onUp(callback: CursorEventCallback<[DragData]>) {
    this.d.cursor.onUp(callback);
  }

  public onScroll(callback: CursorEventCallback<[ScrollData]>) {
    this.d.cursor.onScroll(callback);
  }

  public syncCursorWithStore() {
    this.previousCursorOverBox = this.cursorOverBox;
    this.cursorOverBox = this.d.getBoxByPosition(this.position, this.d.boardViewportStore.zoomLevel);
  }

  private handleDragStart() {
    if (!this.cursorOverBox) {
      return;
    }
  }
}
