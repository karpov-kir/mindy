import { SelectionInterface } from '../../../components';
import { SelectionEventCallback } from '../../../components';
import { Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';
import { BoardSelectionInterface } from './BoardSelectionInterface';

type BoardSelectionDependencies = {
  selection: SelectionInterface;
  getOffset: () => Vector;
};

export class BoardSelection implements BoardSelectionInterface {
  private d: BoardSelectionDependencies;

  public get selectedArea() {
    return this.d.selection.selectedArea
      ? new Rectangle(
          this.d.selection.selectedArea.start.clone().substract(this.d.getOffset()),
          this.d.selection.selectedArea.end.clone().substract(this.d.getOffset()),
        )
      : undefined;
  }

  constructor(d: BoardSelectionDependencies) {
    this.d = d;
  }

  public onSelect(callback: SelectionEventCallback<[Rectangle]>) {
    this.d.selection.onSelect(callback);
  }

  public onSelectEnd(callback: SelectionEventCallback<[Rectangle]>) {
    this.d.selection.onSelectEnd(callback);
  }
}
