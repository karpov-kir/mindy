import { Vector } from '../../math/vectors';
import { KEYS, onKeyDown } from '../../utils/keyboard';
import { ChangeCallback, ChangeEvent, HeightChangeCallback, TextEditorInterface } from './TextEditorInterface';

export class TextEditor implements TextEditorInterface {
  public width = 100;

  public get height() {
    return this._height;
  }

  public set height(height: number) {
    this.textAreaElement.style.height = `${height}px`;
    this._height = height;
  }

  private _height = 100;

  public set content(content: string) {
    this._content = content;
    this.textAreaElement.value = content;
  }

  public get content() {
    return this._content;
  }

  private _content = '';

  private textAreaElement = document.createElement('textarea');
  private textAreaWrapperElement = document.createElement('div');

  private heightChangeCallbacks: HeightChangeCallback[] = [];
  private lastHeightCallbackFiredFor = this.height;

  constructor(containerElement: HTMLElement) {
    this.textAreaElement.style.margin = '0';
    this.textAreaElement.style.padding = '5px';
    this.textAreaElement.style.background = 'transparent';
    this.textAreaElement.style.position = 'absolute';
    this.textAreaElement.style.border = 'none';
    this.textAreaElement.style.resize = 'none';
    this.textAreaElement.style.outline = 'none';
    this.textAreaElement.style.boxSizing = 'border-box';
    this.textAreaElement.style.overflow = 'hidden';
    this.textAreaElement.style.left = '0';
    this.textAreaElement.style.top = '0';
    this.textAreaElement.style.color = 'transparent';
    this.textAreaElement.style.caretColor = 'black';

    this.textAreaElement.style.fontFamily = 'Roboto';
    this.textAreaElement.style.lineHeight = '16px';
    this.textAreaElement.style.fontSize = '14px';

    this.textAreaWrapperElement.style.overflow = 'hidden';
    this.textAreaWrapperElement.style.width = '100%';
    this.textAreaWrapperElement.style.height = '100%';
    this.textAreaWrapperElement.style.display = 'none';
    this.textAreaWrapperElement.style.position = 'absolute';
    this.textAreaWrapperElement.style.left = '0px';
    this.textAreaWrapperElement.style.top = '0px';

    containerElement.appendChild(this.textAreaWrapperElement);
    this.textAreaWrapperElement.appendChild(this.textAreaElement);

    this.textAreaElement.addEventListener('input', (event) => this.handleInput(event as ChangeEvent));

    // TODO expose onHide with reason 'keyboard' and clean `showForBox` in `BoxTextEditor`
    onKeyDown(KEYS.escape, () => this.hide());
  }

  public showAt(position: Vector) {
    this.textAreaWrapperElement.style.display = 'block';
    this.textAreaElement.style.width = `${this.width}px`;
    this.textAreaElement.style.left = `${position.x}px`;
    this.textAreaElement.style.top = `${position.y}px`;

    this.lastHeightCallbackFiredFor = this.height;

    this.textAreaElement.focus();
  }

  public hide() {
    this.textAreaElement.blur();

    this.textAreaWrapperElement.style.display = 'none';

    this.content = '';
  }

  public onInput(callback: ChangeCallback) {
    this.textAreaElement.addEventListener('input', (event) => callback(event as ChangeEvent));
  }

  public onChange(callback: ChangeCallback) {
    this.textAreaElement.addEventListener('change', (event) => callback(event as ChangeEvent));
  }

  public onHeightChange(callback: HeightChangeCallback) {
    this.heightChangeCallbacks.push(callback);
  }

  private handleInput(event: ChangeEvent) {
    this.content = event.target.value;

    if (this.lastHeightCallbackFiredFor !== this.textAreaElement.scrollHeight) {
      this.height = this.textAreaElement.scrollHeight;

      this.heightChangeCallbacks.forEach((callback) =>
        callback(event, {
          height: this.height,
          delta: this.height - this.lastHeightCallbackFiredFor,
        }),
      );

      this.lastHeightCallbackFiredFor = this.height;
    }
  }
}
