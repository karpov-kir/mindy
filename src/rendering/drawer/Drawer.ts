import { DimensionsRectangle } from '../../math/rectangle';
import { Vector } from '../../math/vectors';
import {
  ClearAreaOptions,
  CursorType,
  DimensionsOptions,
  DrawerInterface,
  GetTextLinesOptions,
  LineOptions,
  RectangleOptions,
  TextAfterPointOptions,
  TextInRectangleOptions,
  TextLinesOptions,
  TextOptions,
} from './DrawerInterface';

export class Drawer implements DrawerInterface {
  private context: CanvasRenderingContext2D;
  private _offset = new Vector();

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  private static mergeWithDefaultTextOptions({
    fontFamily = 'Roboto',
    fontSize = 14,
    lineHeight = 16,
    padding = 5,
  }: Partial<TextOptions>) {
    return {
      fontFamily,
      fontSize,
      lineHeight,
      padding,
    };
  }

  public clearArea({ area: _area, offset = new Vector() }: ClearAreaOptions) {
    const area = _area.clone().add(offset);
    const startX = area.start.x;
    const startY = area.start.y;
    const width = area.end.x - startX;
    const height = area.end.y - startY;

    this.context.clearRect(startX, startY, width, height);
  }

  public rectangle({
    fillStyle = 'red',
    lineWidth = 1,
    strokeStyle = 'transparent',
    rectangle: _rectangle,
    zoomLevel = 1,
    offset = new Vector(),
  }: RectangleOptions) {
    const rectangle = (_rectangle instanceof DimensionsRectangle ? _rectangle.toRectangle() : _rectangle)
      .clone()
      .multiply(
        new Vector({
          x: zoomLevel,
          y: zoomLevel,
        }),
      )
      .add(offset);

    this.context.strokeStyle = strokeStyle;
    this.context.lineWidth = lineWidth;
    this.context.fillStyle = fillStyle;

    this.context.beginPath();
    this.context.rect(rectangle.start.x, rectangle.start.y, rectangle.width, rectangle.height);
    this.context.fill();
    this.context.stroke();
  }

  public line({
    from: _from,
    to: _to,
    strokeStyle = 'black',
    lineWidth = 1,
    zoomLevel = 1,
    offset = new Vector(),
  }: LineOptions) {
    const from = _from
      .clone()
      .multiply(new Vector({ x: zoomLevel, y: zoomLevel }))
      .add(offset);

    const to = _to
      .clone()
      .multiply(new Vector({ x: zoomLevel, y: zoomLevel }))
      .add(offset);

    this.context.strokeStyle = strokeStyle;
    this.context.lineWidth = lineWidth;

    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  public getTextLines(options: GetTextLinesOptions) {
    const { fontFamily, fontSize: _fontSize, padding: _padding } = Drawer.mergeWithDefaultTextOptions(options);
    const { text, rectangle: _rectangle, zoomLevel = 1 } = options;
    const fontSize = _fontSize * zoomLevel;
    const padding = _fontSize * _padding;

    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    const rectangle = (_rectangle instanceof DimensionsRectangle ? _rectangle.toRectangle() : _rectangle)
      .clone()
      .multiply(
        new Vector({
          x: zoomLevel,
          y: zoomLevel,
        }),
      );
    const widthToFitText = rectangle.width - padding * 2;
    const lines = [];
    const characterCount = text.length;

    let buffer = '';
    let previousBuffer = '';
    for (let i = 0; i < characterCount; i++) {
      const character = text[i];

      previousBuffer = buffer;
      buffer += character;

      const bufferWidth = this.context.measureText(buffer).width;

      if (character === '\n') {
        lines.push(previousBuffer);
        buffer = '';
      } else if (bufferWidth > widthToFitText) {
        lines.push(previousBuffer);
        buffer = '';
        i--;
      }
    }

    if (buffer) {
      lines.push(buffer);
    }

    return lines;
  }

  public textLinesAfterPoint(options: TextLinesOptions) {
    const { position: _position, lines, fontFamily, offset = new Vector(), zoomLevel = 1 } = options;
    const {
      lineHeight: _lineHeight,
      padding: _padding,
      fontSize: _fontSize,
    } = Drawer.mergeWithDefaultTextOptions(options);
    const lineHeight = _lineHeight * zoomLevel;
    const padding = _padding * zoomLevel;
    const fontSize = _fontSize * zoomLevel;
    const lineHeightOffset = lineHeight / fontSize;
    const position = _position
      .clone()
      .multiply(
        new Vector({
          x: zoomLevel,
          y: zoomLevel,
        }),
      )
      .add(offset);

    this.context.fillStyle = 'black';
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    let topOffset = 0;
    lines.forEach((line) => {
      this.context.fillText(line, position.x + padding, position.y + padding + lineHeightOffset + topOffset);
      topOffset += lineHeight;
    });
  }

  public textInRectangle(options: TextInRectangleOptions) {
    const lines = this.getTextLines(options);
    const { rectangle: _rectangle } = options;
    const rectangle = _rectangle instanceof DimensionsRectangle ? _rectangle.toRectangle() : _rectangle;

    this.textLinesAfterPoint({
      ...options,
      position: rectangle.start,
      lines,
    });
  }

  public textAfterPoint(options: TextAfterPointOptions) {
    const { position: _position, text, offset = new Vector(), zoomLevel = 1 } = options;
    const position = _position
      .clone()
      .multiply(
        new Vector({
          x: zoomLevel,
          y: zoomLevel,
        }),
      )
      .add(offset);

    const { padding, fontSize: _fontSize, fontFamily } = Drawer.mergeWithDefaultTextOptions(options);
    const fontSize = _fontSize * zoomLevel;

    this.context.fillStyle = 'black';
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    this.context.fillText(text, position.x + padding, position.y + padding);
  }

  public cursor(type: CursorType) {
    this.context.canvas.style.cursor = type;
  }

  public dimensions({ width, height }: DimensionsOptions) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
  }
}
