import { ScrollData } from '../../components';
import { Vector } from '../../math/vectors';
import { CursorType } from '../../rendering';
import { DragData } from '../../utils/dom';
import { KEYS, onKeyDown, onKeysDown, onKeyUp } from '../../utils/keyboard';
import { BoardCursorInterface } from '../components';
import { BoardViewportStoreInterface } from '../stores';

type BoardManagerDependencies = {
  boardCursor: BoardCursorInterface;
  boardViewportStore: BoardViewportStoreInterface;
};

export class BoardViewportController {
  private d: BoardManagerDependencies;

  constructor(d: BoardManagerDependencies) {
    this.d = d;

    this.d.boardCursor.onScroll((event, position, data) => this.handleScroll(data));
    this.d.boardCursor.onDrag((event, position, data) => this.handleDrag(data));

    onKeyDown(KEYS.space, () => this.handleSpaceDown());
    onKeyUp(KEYS.space, () => this.handleSpaceUp());
    onKeysDown([KEYS.alt, KEYS.plus], () => this.zoom(1));

    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
  }

  private zoom(
    // -1 - zoom out, 1 - zoom in
    zoomDirection: number,
  ) {
    const maxZoomLevel = 100;
    const minZoomLevel = 0.3;
    const {
      boardViewportStore,
      boardCursor,
      boardViewportStore: { zoomLevel, cursorPosition, offset, absoluteCursorPosition },
    } = this.d;
    // From 0 (0%) to 1 (100%) or more
    const zoomIntensity = 0.05;
    const zoomRelativeDifference = zoomDirection * zoomIntensity;
    let newZoomLevel = zoomLevel + zoomRelativeDifference;

    if (newZoomLevel < minZoomLevel) {
      newZoomLevel = minZoomLevel;
    } else if (newZoomLevel > maxZoomLevel) {
      newZoomLevel = maxZoomLevel;
    }

    if (zoomLevel === newZoomLevel) {
      return;
    }

    // 0 - 0%, 1 - 100% (x2), so 0.05 - 5%
    const zoomChange = newZoomLevel - zoomLevel;
    const adjustOffsetVector = absoluteCursorPosition.clone().multiply(
      new Vector({
        x: zoomChange,
        y: zoomChange,
      }),
    );

    boardViewportStore.zoomLevel = newZoomLevel;
    offset.substract(adjustOffsetVector);
    boardCursor.syncCursorWithStore();
  }

  private handleScroll({ delta }: ScrollData) {
    const zoomDirection = -1 * Math.sign(delta.y);
    this.zoom(zoomDirection);
  }

  private handleSpaceDown() {
    if (this.d.boardCursor.cursorOverBox) {
      return;
    }

    this.d.boardViewportStore.isMovingViewPort = true;
    this.d.boardViewportStore.cursorType = CursorType.Grab;
  }

  private handleDrag({ delta }: DragData) {
    if (!this.d.boardViewportStore.isMovingViewPort) {
      return;
    }

    this.d.boardViewportStore.offset.add(delta);
  }

  private handleSpaceUp() {
    if (!this.d.boardViewportStore.isMovingViewPort) {
      return;
    }

    this.d.boardViewportStore.isMovingViewPort = false;
    this.d.boardViewportStore.cursorType = CursorType.Default;
  }

  private handleResize() {
    this.d.boardViewportStore.width = window.innerWidth;
    this.d.boardViewportStore.height = window.innerHeight;
  }
}
