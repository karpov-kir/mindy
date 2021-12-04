import { BoxInterface, Relation, RelationInterface } from '../../../entities';
import { Vector } from '../../../math/vectors';
import { BoardBoxesStoreInterface, DeleteCallback } from './BoardBoxesStoreInterface';

export class BoardBoxesStore implements BoardBoxesStoreInterface {
  private deleteCallbacks: DeleteCallback[] = [];
  public boxes: Map<number, BoxInterface> = new Map();
  // Boxes which were touched last are at the ned of this array.
  // Boxes with the highest priority (at the end) should be rendered last.
  public prioritizedBoxes: BoxInterface[] = [];
  public draggingBoxOverBoxes: Map<number, BoxInterface> = new Map();
  public relations: Map<number, RelationInterface> = new Map();

  public highlightedBoxes: Map<number, BoxInterface> = new Map();
  public selectedBoxes: Map<number, BoxInterface> = new Map();
  public draggingBox?: BoxInterface;

  // TODO can be optimised? E.g. use a linked list + map approach.
  public riseBoxPriority(box: BoxInterface) {
    let index = -1;

    // Check from end in case if the box has the max priority
    // eslint-disable-next-line for-direction
    for (let i = this.prioritizedBoxes.length - 1; i >= 0; i++) {
      const box = this.prioritizedBoxes[i];

      if (this.prioritizedBoxes[i] === box) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return;
    }

    this.prioritizedBoxes.splice(index, 1);
    this.prioritizedBoxes.push(box);
  }

  public add(box: BoxInterface) {
    this.boxes.set(box.id, box);
    this.prioritizedBoxes.push(box);

    return box;
  }

  public delete(box: BoxInterface) {
    this.boxes.delete(box.id);
    this.selectedBoxes.delete(box.id);
    this.highlightedBoxes.delete(box.id);

    const prioritizedBoxIndex = this.prioritizedBoxes.indexOf(box);

    box.relations.forEach((relation) => {
      const toBoxRelationIndex = relation.toBox.relations.indexOf(relation);

      relation.toBox.relations.splice(toBoxRelationIndex, 1);

      this.relations.delete(relation.id);
    });

    // TODO can be optimised? E.g. use a linked list + map approach.
    if (prioritizedBoxIndex !== -1) {
      this.prioritizedBoxes.splice(prioritizedBoxIndex, 1);
    }

    this.deleteCallbacks.forEach((callback) => callback(box));
  }

  // TODO don't iterate all boxes (improve performance).
  public getBoxByPosition(position: Vector, zoomLevel = 1) {
    const zoomVector = new Vector({
      x: zoomLevel,
      y: zoomLevel,
    });

    for (let i = this.prioritizedBoxes.length - 1; i >= 0; i--) {
      const box = this.prioritizedBoxes[i];

      if (box.toRectangle().multiply(zoomVector).isPointInside(position)) {
        return box;
      }
    }
  }

  public connectBox(fromBox: BoxInterface, toBoxes: BoxInterface[] | Map<number, BoxInterface>) {
    toBoxes.forEach((toBox) => {
      const existedRelation = fromBox.relations.find(
        (relationToCheck) =>
          (toBox.id === relationToCheck.toBox.id && fromBox.id === relationToCheck.fromBox.id) ||
          (toBox.id === relationToCheck.fromBox.id && fromBox.id === relationToCheck.toBox.id),
      );

      // If relation exists, then we need to delete this relation
      if (existedRelation) {
        fromBox.relations = fromBox.relations.filter(({ id }) => existedRelation.id !== id);
        toBox.relations = fromBox.relations.filter(({ id }) => existedRelation.id !== id);

        this.relations.delete(existedRelation.id);
      }
      // Create relation
      else {
        const relation = new Relation(fromBox, toBox);

        fromBox.relations.push(relation);
        toBox.relations.push(relation);

        this.relations.set(relation.id, relation);
      }
    });
  }

  public onDelete(callback: DeleteCallback) {
    this.deleteCallbacks.push(callback);
  }
}
