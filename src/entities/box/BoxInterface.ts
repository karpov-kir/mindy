import { DimensionsRectangle } from '../../math/rectangle';
import { RelationInterface } from '../relation';

export type BoxInterface = {
  id: number;
  content: string;
  relations: RelationInterface[];
} & DimensionsRectangle;
