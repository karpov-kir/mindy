import { Vector } from '../../math/vectors';
import { BoardCursorInterface, BoardSelectionInterface } from '../components';
import { BoardBoxesStoreInterface, BoardViewportStoreInterface } from '../stores';

type BoardSelectionControllerDependencies = {
  boardSelection: BoardSelectionInterface;
  boardBoxesStore: BoardBoxesStoreInterface;
  boardCursor: BoardCursorInterface;
  boardViewportStore: BoardViewportStoreInterface;
};

export class BoardSelectionController {
  private d: BoardSelectionControllerDependencies;

  constructor(d: BoardSelectionControllerDependencies) {
    this.d = d;

    this.d.boardSelection.onSelect(() => this.handleSelect());
    this.d.boardSelection.onSelectEnd(() => this.handleSelectEnd());
  }

  private handleSelect() {
    if (this.d.boardCursor.cursorOverBox || this.d.boardViewportStore.isMovingViewPort) {
      return;
    }

    this.d.boardViewportStore.selectedArea = this.d.boardSelection.selectedArea;

    for (const box of this.d.boardBoxesStore.prioritizedBoxes) {
      const zoomedBox = box.toRectangle().multiply(
        new Vector({
          x: this.d.boardViewportStore.zoomLevel,
          y: this.d.boardViewportStore.zoomLevel,
        }),
      );

      if (this.d.boardSelection.selectedArea!.intersects(zoomedBox)) {
        this.d.boardBoxesStore.selectedBoxes.set(box.id, box);
      } else {
        this.d.boardBoxesStore.selectedBoxes.delete(box.id);
      }
    }
  }

  private handleSelectEnd() {
    this.d.boardViewportStore.selectedArea = undefined;
  }
}
