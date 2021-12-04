import { SelectionEventCallback } from '../../../components';
import { Rectangle } from '../../../math/rectangle';

export type BoardSelectionInterface = {
  selectedArea?: Rectangle;

  onSelect: (callback: SelectionEventCallback<[Rectangle]>) => void;
  onSelectEnd: (callback: SelectionEventCallback<[Rectangle]>) => void;
};
