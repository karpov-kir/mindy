import { BoxInterface } from '../../../entities';

export type BoxDrawnCallback = (box: BoxInterface) => void;

export type BoxesOptions = {
  onAfterBoxDrawn?: BoxDrawnCallback;
};

export type BoardBoxesDrawerInterface = {
  relations: () => void;
  boxes: (options: BoxesOptions) => void;
  selectedArea: () => void;
};
