import { Rectangle } from '../../math/rectangle';
import { getPositionFromMouseEvent } from '../../utils/dom';
import { CursorInterface } from '../cursor';
import { SelectionEventCallback, SelectionInterface } from './SelectionInterface';

export class Selection implements SelectionInterface {
  private cursor: CursorInterface;
  private lastDownEvent?: MouseEvent;
  private isMouseDown = false;
  private selectStartCallbacks: SelectionEventCallback[] = [];
  private selectCallbacks: SelectionEventCallback<[Rectangle]>[] = [];
  private selectEndCallbacks: SelectionEventCallback<[Rectangle]>[] = [];

  public selectedArea?: Rectangle;

  constructor(cursor: CursorInterface) {
    this.cursor = cursor;

    this.cursor.onDown((event) => this.handleDown(event));
    this.cursor.onMove((event) => this.handleMove(event));
    this.cursor.onUp((event) => this.handleUp(event));
  }

  public onSelectStart(callback: SelectionEventCallback) {
    this.selectStartCallbacks.push(callback);
  }

  public onSelect(callback: SelectionEventCallback<[Rectangle]>) {
    this.selectCallbacks.push(callback);
  }

  public onSelectEnd(callback: SelectionEventCallback<[Rectangle]>) {
    this.selectEndCallbacks.push(callback);
  }

  private getSelection(event: MouseEvent) {
    if (!this.lastDownEvent) {
      return new Rectangle();
    }

    const pointFromLastDown = getPositionFromMouseEvent(this.lastDownEvent, this.cursor.containerElement);
    const currentPoint = getPositionFromMouseEvent(event, this.cursor.containerElement);

    return new Rectangle(pointFromLastDown, currentPoint).sort();
  }

  private handleDown(event: MouseEvent) {
    this.lastDownEvent = event;
    this.isMouseDown = true;
    this.selectedArea = this.getSelection(event);

    this.selectStartCallbacks.forEach((callback) => callback(event, this));
  }

  private handleMove(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }

    this.selectedArea!.updateFrom(this.getSelection(event));

    this.selectCallbacks.forEach((callback) => callback(event, this, this.selectedArea!));
  }

  private handleUp(event: MouseEvent) {
    this.isMouseDown = false;

    // TODO investigate why this happens on double click
    if (!this.selectedArea) {
      return;
    }

    this.selectedArea.updateFrom(this.getSelection(event));

    this.selectEndCallbacks.forEach((callback) => callback(event, this, this.selectedArea!));

    this.selectedArea = undefined;
  }
}
