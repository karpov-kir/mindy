import { RendererInterface } from '../../rendering';
import { BoardBoxesDrawerInterface, BoardDrawerInterface, DebugDrawerInterface } from '../rendering';

type BoardDrawerControllerDependencies = {
  renderer: RendererInterface;
  boardDrawer: BoardDrawerInterface;
  boardBoxesDrawer: BoardBoxesDrawerInterface;
  debugDrawer: DebugDrawerInterface;
};

export class BoardRenderController {
  private d: BoardDrawerControllerDependencies;

  constructor(d: BoardDrawerControllerDependencies) {
    this.d = d;

    this.d.renderer.onAnimate(() => this.handleAnimate());
  }

  // TODO optimise rendering
  private handleAnimate() {
    // Sync some global settings
    this.d.boardDrawer.cursor();
    this.d.boardDrawer.dimensions();

    // 1st layer
    this.d.boardDrawer.clearBoard();
    this.d.debugDrawer.colorBoard();

    // 2nd layer
    this.d.boardBoxesDrawer.relations();

    // 3rd layer
    this.d.boardBoxesDrawer.boxes({
      onAfterBoxDrawn: (box) => this.d.debugDrawer.rectangleCoordinates(box),
    });

    // 4th layer
    this.d.boardBoxesDrawer.selectedArea();
    this.d.debugDrawer.selectedAreaCoordinates();

    // 5th layer
    this.d.debugDrawer.centerGuides();

    // 5th layer
    this.d.debugDrawer.cursorCoordinates();
  }
}
