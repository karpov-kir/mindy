import { HeightData } from '../../components';
import { BoxInterface } from '../../entities';
import { KEYS, onKeyPressed } from '../../utils/keyboard';
import { BoardTextEditorInterface } from '../components';

type BoardBoxesControllerDependencies = {
  boardTextEditor: BoardTextEditorInterface;
  getSelectedBoxes: () => Map<number, BoxInterface>;
  deleteBox: (box: BoxInterface) => void;
};

export class BoardBoxesController {
  private d: BoardBoxesControllerDependencies;

  constructor(d: BoardBoxesControllerDependencies) {
    this.d = d;

    this.d.boardTextEditor.onHeightChange((event, data) => this.handleHeightChange(data));

    onKeyPressed(KEYS.delete, () => this.handleDeletePressed());
  }
  private handleHeightChange({ delta }: HeightData) {
    if (this.d.boardTextEditor.showForBox) {
      this.d.boardTextEditor.showForBox.height += delta;
    }
  }

  private handleDeletePressed() {
    this.d.boardTextEditor.hide();

    for (const [, box] of this.d.getSelectedBoxes()) {
      this.d.deleteBox(box);
    }
  }
}
