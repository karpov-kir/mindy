import { Vector } from '../../math/vectors';
import { DragData, DragMode, DragStartData, extendedClickHandler, getPositionFromMouseEvent } from '../../utils/dom';
import { CursorEventCallback, CursorInterface, ScrollData } from './CursorInterface';

export class Cursor implements CursorInterface {
  public position: Vector;
  public containerElement: HTMLElement;

  private downCallbacks: CursorEventCallback[] = [];
  private tapCallbacks: CursorEventCallback[] = [];
  private doubleTapCallbacks: CursorEventCallback[] = [];
  private dragStartCallbacks: CursorEventCallback<[DragStartData]>[] = [];
  private dragCallbacks: CursorEventCallback<[DragData]>[] = [];
  private dragEndCallbacks: CursorEventCallback<[DragData]>[] = [];
  private upCallbacks: CursorEventCallback<[DragData]>[] = [];
  private scrollCallbacks: CursorEventCallback<[ScrollData]>[] = [];

  constructor(containerElement: HTMLElement, position: Vector = new Vector()) {
    this.position = position;

    this.containerElement = containerElement;
    this.containerElement.addEventListener('wheel', (event) => this.handleScroll(event));
    this.containerElement.addEventListener('mousemove', (event) => this.handleMove(event));
    extendedClickHandler(containerElement, {
      debug: false,
      silenceClickAfterDrag: true,
      dragMode: DragMode.Down,
      onClick: (event) => this.handleClick(event),
      onDoubleClick: (event) => this.handleDoubleClick(event),
      onDragStart: (event, data) => this.handleDragStart(event, data),
      onDrag: (event, data) => this.handleDrag(event, data),
      onDragEnd: (event, data) => this.handleDragEnd(event, data),
      onMouseDown: (event) => this.handleMouseDown(event),
      onMouseUp: (event, data) => this.handleMouseUp(event, data),
    });
  }

  public onDown(callback: CursorEventCallback) {
    this.downCallbacks.push(callback);
  }

  public onTap(callback: CursorEventCallback) {
    this.tapCallbacks.push(callback);
  }

  public onDoubleTap(callback: CursorEventCallback) {
    this.doubleTapCallbacks.push(callback);
  }

  public onMove(callback: CursorEventCallback) {
    this.containerElement.addEventListener('mousemove', (event) => callback(event, this.position));
  }

  public onDragStart(callback: CursorEventCallback<[DragStartData]>) {
    this.dragStartCallbacks.push(callback);
  }

  public onDrag(callback: CursorEventCallback<[DragData]>) {
    this.dragCallbacks.push(callback);
  }

  public onDragEnd(callback: CursorEventCallback<[DragData]>) {
    this.dragEndCallbacks.push(callback);
  }

  public onUp(callback: CursorEventCallback<[DragData]>) {
    this.upCallbacks.push(callback);
  }

  public onScroll(callback: CursorEventCallback<[ScrollData]>) {
    this.scrollCallbacks.push(callback);
  }

  // ==============================

  private handleMove(event: MouseEvent) {
    this.position.updateFrom(getPositionFromMouseEvent(event, this.containerElement));
  }

  private handleMouseDown(event: MouseEvent) {
    this.downCallbacks.forEach((callback) => callback(event, this.position));
  }

  private handleClick(event: MouseEvent) {
    this.tapCallbacks.forEach((callback) => callback(event, this.position));
  }

  private handleDoubleClick(event: MouseEvent) {
    this.doubleTapCallbacks.forEach((callback) => callback(event, this.position));
  }

  private handleDragStart(event: MouseEvent, data: DragStartData) {
    this.dragStartCallbacks.forEach((callback) => callback(event, this.position, data));
  }

  private handleDrag(event: MouseEvent, data: DragData) {
    this.dragCallbacks.forEach((callback) => callback(event, this.position, data));
  }

  private handleDragEnd(event: MouseEvent, data: DragData) {
    this.dragEndCallbacks.forEach((callback) => callback(event, this.position, data));
  }

  private handleMouseUp(event: MouseEvent, data: DragData) {
    this.upCallbacks.forEach((callback) => callback(event, this.position, data));
  }

  private handleScroll(event: WheelEvent) {
    const scrollData = {
      delta: new Vector({
        x: event.deltaX,
        y: event.deltaY,
      }),
    };

    this.scrollCallbacks.forEach((callback) => callback(event, this.position, scrollData));
  }
}
