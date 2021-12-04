import { Rectangle } from '../../math/rectangle';

export type SelectionEventCallback<AdditionalArgs extends Array<unknown> = []> = (
  event: MouseEvent,
  selection: SelectionInterface,
  ...args: AdditionalArgs
) => void;

export type SelectionInterface = {
  selectedArea?: Rectangle;

  onSelectStart: (callback: SelectionEventCallback) => void;
  onSelect: (callback: SelectionEventCallback<[Rectangle]>) => void;
  onSelectEnd: (callback: SelectionEventCallback<[Rectangle]>) => void;
};
