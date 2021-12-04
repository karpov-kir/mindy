import { Box } from '../../entities';
import { Vector } from '../../math/vectors';
import { DragData } from '../../utils/dom';
import { BoardCursorInterface, BoardSelectionInterface, BoardTextEditorInterface } from '../components';
import { BoardBoxesStoreInterface } from '../stores';

type BoardCursorControllerDependencies = {
  boardBoxesStore: BoardBoxesStoreInterface;
  boardCursor: BoardCursorInterface;
  boardTextEditor: BoardTextEditorInterface;
  boardSelection: BoardSelectionInterface;
  getZoomLevel: () => number;
};

export class BoardCursorController {
  private d: BoardCursorControllerDependencies;

  constructor(d: BoardCursorControllerDependencies) {
    this.d = d;

    this.d.boardCursor.onMove(() => this.handleCursorMove());
    this.d.boardCursor.onDown(() => this.handleDown());
    this.d.boardCursor.onTap(() => this.handleTap());
    this.d.boardCursor.onDoubleTap(() => this.handleDoubleTap());
    this.d.boardCursor.onDragStart(() => this.handleDragStart());
    this.d.boardCursor.onDrag((event, position, data) => this.handleDrag(data));
    this.d.boardCursor.onUp((event, position, data) => this.handleUp(data));
  }

  private handleCursorMove() {
    // We need to handle moving the cursor only to highlight boxes
    // if the user is not dragging a box already.
    if (this.d.boardBoxesStore.draggingBox || this.d.boardSelection.selectedArea) {
      return;
    }

    if (
      this.d.boardCursor.previousCursorOverBox &&
      this.d.boardCursor.cursorOverBox !== this.d.boardCursor.previousCursorOverBox
    ) {
      this.d.boardBoxesStore.highlightedBoxes.delete(this.d.boardCursor.previousCursorOverBox.id);
    }

    if (this.d.boardCursor.cursorOverBox) {
      this.d.boardBoxesStore.highlightedBoxes.set(
        this.d.boardCursor.cursorOverBox.id,
        this.d.boardCursor.cursorOverBox,
      );
    }
  }

  private handleDown() {
    if (this.d.boardCursor.cursorOverBox) {
      if (this.d.boardBoxesStore.selectedBoxes.size === 1) {
        this.d.boardBoxesStore.selectedBoxes.clear();
      }

      this.d.boardBoxesStore.selectedBoxes.set(this.d.boardCursor.cursorOverBox.id, this.d.boardCursor.cursorOverBox);
    } else {
      this.d.boardBoxesStore.selectedBoxes.clear();
    }
  }

  private handleTap() {
    if (this.d.boardCursor.cursorOverBox) {
      this.d.boardTextEditor.showAt(this.d.boardCursor.cursorOverBox);
    } else {
      this.d.boardTextEditor.hide();
    }
  }

  private handleDoubleTap() {
    if (this.d.boardCursor.cursorOverBox) {
      return;
    }

    const newBox = new Box();

    newBox.position = new Vector({
      x: this.d.boardCursor.position.x - (newBox.width * this.d.getZoomLevel()) / 2,
      y: this.d.boardCursor.position.y - (newBox.height * this.d.getZoomLevel()) / 2,
    }).devide(
      new Vector({
        x: this.d.getZoomLevel(),
        y: this.d.getZoomLevel(),
      }),
    );

    this.d.boardBoxesStore.add(newBox);
    this.d.boardBoxesStore.highlightedBoxes.set(newBox.id, newBox);
    this.d.boardBoxesStore.selectedBoxes.set(newBox.id, newBox);
    this.d.boardTextEditor.showAt(newBox);

    this.d.boardCursor.cursorOverBox = newBox;
  }

  private handleDragStart() {
    if (!this.d.boardCursor.cursorOverBox) {
      return;
    }

    this.d.boardBoxesStore.draggingBox = this.d.boardCursor.cursorOverBox;
    this.d.boardTextEditor.hide();
  }

  private handleDrag({ delta }: DragData) {
    if (!this.d.boardBoxesStore.draggingBox) {
      return;
    }

    const draggingBoxRectangle = this.d.boardBoxesStore.draggingBox.toRectangle();

    // TODO group boxes to clusters to iterate less (improve performance).
    // TODO optimise via `draggingBoxOverBoxes`.
    for (const box of this.d.boardBoxesStore.prioritizedBoxes) {
      if (box === this.d.boardBoxesStore.draggingBox) {
        continue;
      }

      const isAlreadyHovered = this.d.boardBoxesStore.draggingBoxOverBoxes.has(box.id);
      const hasIntersection = draggingBoxRectangle.intersects(box.toRectangle());

      if (hasIntersection && !isAlreadyHovered) {
        this.d.boardBoxesStore.draggingBoxOverBoxes.set(box.id, box);
        this.d.boardBoxesStore.highlightedBoxes.set(box.id, box);
      } else if (!hasIntersection && isAlreadyHovered) {
        this.d.boardBoxesStore.draggingBoxOverBoxes.delete(box.id);
        this.d.boardBoxesStore.highlightedBoxes.delete(box.id);
      }
    }

    const zoomedDelta = delta.devide(
      new Vector({
        x: this.d.getZoomLevel(),
        y: this.d.getZoomLevel(),
      }),
    );
    for (const [, box] of this.d.boardBoxesStore.selectedBoxes) {
      box.position.add(zoomedDelta);
    }
  }

  private handleUp({ totalDelta }: DragData) {
    if (!this.d.boardBoxesStore.draggingBox) {
      if (this.d.boardCursor.cursorOverBox) {
        this.d.boardBoxesStore.selectedBoxes.clear();
        this.d.boardBoxesStore.selectedBoxes.set(this.d.boardCursor.cursorOverBox.id, this.d.boardCursor.cursorOverBox);
      }

      return;
    }

    for (const [id] of this.d.boardBoxesStore.draggingBoxOverBoxes) {
      this.d.boardBoxesStore.highlightedBoxes.delete(id);
    }

    if (this.d.boardBoxesStore.draggingBoxOverBoxes.size > 0) {
      for (const [, box] of this.d.boardBoxesStore.selectedBoxes) {
        box.position.substract(totalDelta);
        this.d.boardBoxesStore.connectBox(box, this.d.boardBoxesStore.draggingBoxOverBoxes);
      }
    }

    this.d.boardBoxesStore.draggingBoxOverBoxes.clear();
    this.d.boardBoxesStore.draggingBox = undefined;
  }
}
