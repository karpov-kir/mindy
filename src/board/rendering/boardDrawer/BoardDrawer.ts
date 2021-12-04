import { Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';
import { DrawerInterface } from '../../../rendering';
import { BoardViewportStoreInterface } from '../../stores';
import { BoardDrawerInterface } from './BoardDrawerInterface';

type BoardDrawerDependencies = {
  drawer: DrawerInterface;
  boardViewportStore: BoardViewportStoreInterface;
};

export class BoardDrawer implements BoardDrawerInterface {
  private d: BoardDrawerDependencies;

  constructor(d: BoardDrawerDependencies) {
    this.d = d;
  }

  public cursor() {
    this.d.drawer.cursor(this.d.boardViewportStore.cursorType);
  }

  public clearBoard() {
    this.d.drawer.clearArea({
      area: new Rectangle(
        new Vector(),
        new Vector({
          x: this.d.boardViewportStore.width,
          y: this.d.boardViewportStore.height,
        }),
      ),
      offset: this.d.boardViewportStore.offset,
    });
  }

  public dimensions() {
    this.d.drawer.dimensions({
      width: this.d.boardViewportStore.width,
      height: this.d.boardViewportStore.height,
    });
  }
}
