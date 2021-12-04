import { BoxInterface, RelationInterface } from '../../../entities';
import { Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';

export type DeleteCallback = (box: BoxInterface) => void;

export type BoardBoxesStoreInterface = {
  boxes: Map<number, BoxInterface>;
  // Boxes which were touched last are at the ned of this array.
  // Boxes with the highest priority (at the end) should be rendered last.
  prioritizedBoxes: BoxInterface[];
  draggingBoxOverBoxes: Map<number, BoxInterface>;
  relations: Map<number, RelationInterface>;

  highlightedBoxes: Map<number, BoxInterface>;
  selectedBoxes: Map<number, BoxInterface>;
  draggingBox?: BoxInterface;

  riseBoxPriority: (box: BoxInterface) => void;

  add: (box: BoxInterface) => BoxInterface;
  delete: (box: BoxInterface) => void;
  getBoxByPosition: (position: Vector, zoomLevel: number) => BoxInterface | undefined;
  connectBox: (fromBox: BoxInterface, toBoxes: BoxInterface[] | Map<number, BoxInterface>) => void;

  onDelete: (callback: DeleteCallback) => void;
};
