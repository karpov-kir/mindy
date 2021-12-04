import { BoxInterface, RelationInterface } from '../../../entities';
import { DrawerInterface } from '../../../rendering';
import { BoardBoxesDrawerInterface, BoxDrawnCallback, BoxesOptions } from '../../rendering';
import { BoardBoxesStoreInterface, BoardViewportStoreInterface } from '../../stores';

type BoardBoxesDrawerDependencies = {
  drawer: DrawerInterface;
  boardBoxesStore: BoardBoxesStoreInterface;
  boardViewportStore: BoardViewportStoreInterface;
};

export class BoardBoxesDrawer implements BoardBoxesDrawerInterface {
  private d: BoardBoxesDrawerDependencies;
  private afterBoxDrawnCallbacks: BoxDrawnCallback[] = [];

  private boxContentLinesCache: Map<
    number,
    {
      content: string;
      lines: string[];
      width: number;
    }
  > = new Map();

  constructor(d: BoardBoxesDrawerDependencies) {
    this.d = d;

    // TODO find a better way
    this.d.boardBoxesStore.onDelete((box) => this.handleDelete(box));
  }

  public relations() {
    for (const [, relation] of this.d.boardBoxesStore.relations) {
      this.relation(relation);
    }
  }

  public boxes(options: BoxesOptions) {
    for (let i = 0, l = this.d.boardBoxesStore.prioritizedBoxes.length; i < l; i++) {
      const box = this.d.boardBoxesStore.prioritizedBoxes[i];

      this.box(box, options);
    }
  }

  public selectedArea() {
    if (this.d.boardViewportStore.selectedArea) {
      this.d.drawer.rectangle({
        rectangle: this.d.boardViewportStore.selectedArea,
        strokeStyle: 'rgb(22 22 22 / 40%)',
        fillStyle: 'rgb(101 141 255 / 40%)',
        offset: this.d.boardViewportStore.offset,
      });
    }
  }

  private box(box: BoxInterface, { onAfterBoxDrawn }: BoxesOptions) {
    const isSelected = this.d.boardBoxesStore.selectedBoxes.has(box.id);
    const isHighlighted = this.d.boardBoxesStore.highlightedBoxes.has(box.id);

    this.d.drawer.rectangle({
      strokeStyle: isSelected ? 'blue' : 'transparent',
      fillStyle: isHighlighted ? 'red' : 'skyblue',
      rectangle: box,
      zoomLevel: this.d.boardViewportStore.zoomLevel,
      offset: this.d.boardViewportStore.offset,
    });

    if (box.content) {
      this.boxContent(box);
    }

    if (onAfterBoxDrawn) {
      onAfterBoxDrawn(box);
    }
  }

  private getCachedBoxContentLines(box: BoxInterface) {
    let linesCache = this.boxContentLinesCache.get(box.id);

    // Invalidate / create cache if required
    if (!linesCache || box.content !== linesCache.content || box.width !== linesCache.width) {
      const newLines = this.d.drawer.getTextLines({
        text: box.content,
        rectangle: box,
      });

      linesCache = {
        lines: newLines,
        content: box.content,
        width: box.width,
      };

      this.boxContentLinesCache.set(box.id, linesCache);
    }

    return linesCache.lines;
  }

  private boxContent(box: BoxInterface) {
    this.d.drawer.textLinesAfterPoint({
      position: box.toRectangle().start,
      lines: this.getCachedBoxContentLines(box),
      offset: this.d.boardViewportStore.offset,
      zoomLevel: this.d.boardViewportStore.zoomLevel,
    });
  }

  private relation(relation: RelationInterface) {
    const { fromBox, toBox } = relation;
    const fromRectangle = fromBox.toRectangle();
    const toRectangle = toBox.toRectangle();
    const fromPosition = fromRectangle.start.center(fromRectangle.end);
    const toPosition = toRectangle.start.center(toRectangle.end);

    this.d.drawer.line({
      from: fromPosition,
      to: toPosition,
      zoomLevel: this.d.boardViewportStore.zoomLevel,
      offset: this.d.boardViewportStore.offset,
    });
  }

  // TODO move to boxes store cache
  private handleDelete(box: BoxInterface) {
    this.boxContentLinesCache.delete(box.id);
  }
}
