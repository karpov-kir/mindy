import { DimensionsRectangle, Rectangle } from '../../../math/rectangle';
import { Vector } from '../../../math/vectors';
import { DrawerInterface } from '../../../rendering';
import { getRandomInteger } from '../../../utils';
import { BoardViewportStoreInterface } from '../../stores';
import { DebugDrawerInterface, PointCoordinatesOptions } from './DebugDrawerInterface';

type DebugDrawerDependencies = {
  boardViewportStore: BoardViewportStoreInterface;
  drawer: DrawerInterface;
};

export class DebugDrawer implements DebugDrawerInterface {
  private d: DebugDrawerDependencies;

  constructor(d: DebugDrawerDependencies) {
    this.d = d;
  }

  public colorBoard() {
    const styles = ['red', 'green', 'blue', 'black'];
    const max = styles.length - 1;
    const min = 0;
    const style = getRandomInteger(min, max);
    // this.context.fillStyle = styles[];
    // this.context.fillRect(startX, startY, width, height);
  }

  public cursorCoordinates() {
    this.pointCoordinates({
      position: this.d.boardViewportStore.cursorPosition,
      zoomable: false,
    });
  }

  public selectedAreaCoordinates() {
    if (this.d.boardViewportStore.selectedArea) {
      this.rectangleCoordinates(this.d.boardViewportStore.selectedArea, false);
    }
  }

  public pointCoordinates({ position, zoomable = true }: PointCoordinatesOptions) {
    const zoomLevel = zoomable ? this.d.boardViewportStore.zoomLevel : 1;

    this.d.drawer.textAfterPoint({
      fontSize: 11,
      text: position.toString(),
      position: position.clone().add(
        new Vector({
          x: 15,
          y: -5,
        }),
      ),
      offset: this.d.boardViewportStore.offset,
      zoomLevel,
    });
  }

  public rectangleCoordinates(_rectangle: DimensionsRectangle | Rectangle, zoomable = true) {
    const zoomLevel = zoomable ? this.d.boardViewportStore.zoomLevel : 1;
    const zoomVector = new Vector({
      x: zoomLevel,
      y: zoomLevel,
    });
    const rectangle = _rectangle instanceof DimensionsRectangle ? _rectangle.toRectangle() : _rectangle;
    const zoomedRectangle = rectangle.clone().multiply(zoomVector);

    this.d.drawer.textLinesAfterPoint({
      lines: [`${zoomedRectangle.start.toString()} (z)`, rectangle.start.toString()],
      position: new Vector(rectangle.start),
      fontSize: 11,
      offset: this.d.boardViewportStore.offset,
      zoomLevel,
    });
  }

  public centerGuides() {
    const rectangleSize = 3;

    // Center point
    this.d.drawer.rectangle({
      rectangle: new Rectangle(
        this.d.boardViewportStore.center.clone(),
        this.d.boardViewportStore.center.clone().add(
          new Vector({
            x: rectangleSize,
            y: rectangleSize,
          }),
        ),
      )
        .add(this.d.boardViewportStore.offset)
        .centralize(),
    });

    // Vertical guide line
    this.d.drawer.line({
      from: this.d.boardViewportStore.top,
      to: this.d.boardViewportStore.bottom,
    });

    // Horizontal guide line
    this.d.drawer.line({
      from: this.d.boardViewportStore.left,
      to: this.d.boardViewportStore.right,
    });

    // Coordinates
    this.d.drawer.textAfterPoint({
      position: this.d.boardViewportStore.center,
      text: this.d.boardViewportStore.center.toString(),
      fontSize: 11,
      offset: this.d.boardViewportStore.offset,
    });
  }
}
