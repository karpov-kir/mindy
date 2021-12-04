import { HeightChangeCallback } from '../../../components';
import { BoxInterface } from '../../../entities';

export type BoardTextEditorInterface = {
  showForBox?: BoxInterface;

  showAt: (box: BoxInterface) => void;
  hide: () => void;
  onHeightChange: (callback: HeightChangeCallback) => void;
};
