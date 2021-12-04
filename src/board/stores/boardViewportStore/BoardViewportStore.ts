import { Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';
import { CursorType } from '../../../rendering';
import { BoardViewportStoreInterface } from './BoardViewportStoreInterface';

export class BoardViewportStore implements BoardViewportStoreInterface {
  public get center() {
    return new Vector({
      x: this.width / 2,
      y: this.height / 2,
    }).substract(this.offset);
  }

  public get left() {
    return new Vector({
      x: 0,
      y: this.height / 2,
    });
  }

  public get top() {
    return new Vector({
      x: this.width / 2,
      y: 0,
    });
  }

  public get right() {
    return this.left.add(
      new Vector({
        x: this.width,
        y: 0,
      }),
    );
  }

  public get bottom() {
    return this.top.add(
      new Vector({
        x: 0,
        y: this.height,
      }),
    );
  }

  public zoomLevel = 1;
  public offset: Vector = new Vector();
  public cursorType: CursorType = CursorType.Default;
  public isMovingViewPort = false;
  public cursorPosition: Vector = new Vector();
  public absoluteCursorPosition: Vector = new Vector();
  public selectedArea?: Rectangle;
  public width = 0;
  public height = 0;
}
