import { ChangeEvent, HeightChangeCallback, TextEditorInterface } from '../../../components';
import { BoxInterface } from '../../../entities';
import { BoardTextEditorInterface } from './BoardTextEditorInterface';

type BoardTextEditorDependencies = {
  textEditor: TextEditorInterface;
};

export class BoardTextEditor implements BoardTextEditorInterface {
  private d: BoardTextEditorDependencies;

  public showForBox?: BoxInterface;

  constructor(d: BoardTextEditorDependencies) {
    this.d = d;

    this.d.textEditor.onInput((event) => this.handleInput(event));
  }

  public showAt(box: BoxInterface) {
    this.showForBox = box;
    this.d.textEditor.width = box.width;
    this.d.textEditor.height = box.height;
    this.d.textEditor.showAt(box.position);
    this.d.textEditor.content = box.content;
  }

  public hide() {
    this.showForBox = undefined;
    this.d.textEditor.hide();
  }

  public onHeightChange(callback: HeightChangeCallback) {
    this.d.textEditor.onHeightChange(callback);
  }

  private handleInput(event: ChangeEvent) {
    if (!this.showForBox) {
      return;
    }

    return (this.showForBox.content = event.target.value);
  }
}
