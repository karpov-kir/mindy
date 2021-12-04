import { DimensionsRectangle, Rectangle } from '../../math/rectangle';
import { Vector } from '../../math/vectors';

export enum CursorType {
  Default = 'default',
  Grab = 'grab',
}

export type TextOptions = {
  fontFamily: string;
  lineHeight: number;
  fontSize: number;
  padding: number;
};

export type GetTextLinesOptions = {
  text: string;
  rectangle: DimensionsRectangle | Rectangle;
  zoomLevel?: number;
} & Omit<Partial<TextOptions>, 'lineHeight'>;

export type TextInRectangleOptions = {
  text: string;
  rectangle: DimensionsRectangle | Rectangle;
  offset?: Vector;
  zoomLevel?: number;
} & Partial<TextOptions>;

export type TextAfterPointOptions = {
  text: string;
  position: Vector;
  offset?: Vector;
  zoomLevel?: number;
} & Partial<TextOptions>;

export type TextLinesOptions = {
  lines: string[];
  position: Vector;
  offset?: Vector;
  zoomLevel?: number;
} & Partial<TextOptions>;

export type ClearAreaOptions = {
  area: Rectangle;
  offset?: Vector;
};

export type RectangleOptions = {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  rectangle: DimensionsRectangle | Rectangle;
  zoomLevel?: number;
  offset?: Vector;
};

export type LineOptions = {
  from: Vector;
  to: Vector;
  strokeStyle?: string;
  lineWidth?: number;
  zoomLevel?: number;
  offset?: Vector;
};

export type DimensionsOptions = {
  width: number;
  height: number;
};

export type DrawerInterface = {
  clearArea: (options: ClearAreaOptions) => void;
  rectangle: (options: RectangleOptions) => void;
  line: (options: LineOptions) => void;
  getTextLines: (options: GetTextLinesOptions) => string[];
  textLinesAfterPoint: (options: TextLinesOptions) => void;
  textInRectangle: (options: TextInRectangleOptions) => void;
  textAfterPoint: (options: TextAfterPointOptions) => void;
  cursor: (type: CursorType) => void;
  dimensions: (options: DimensionsOptions) => void;
};
