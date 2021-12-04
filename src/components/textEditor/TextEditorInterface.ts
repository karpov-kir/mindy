import { Vector } from '../../math/vectors';

export type HeightData = {
  height: number;
  delta: number;
};

export type ChangeEvent = Event & { target: HTMLTextAreaElement };
export type ChangeCallback = (event: ChangeEvent) => void;
export type HeightChangeCallback = (event: Event, data: HeightData) => void;

export type TextEditorInterface = {
  width: number;
  height: number;
  content: string;

  showAt: (position: Vector) => void;
  hide: () => void;

  onInput: (callback: ChangeCallback) => void;
  onChange: (callback: ChangeCallback) => void;
  onHeightChange: (callback: HeightChangeCallback) => void;
};
