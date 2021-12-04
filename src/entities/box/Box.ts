import { DimensionsRectangle } from '../../math/rectangle';
import { getIdGenerator } from '../../utils';
import { RelationInterface } from '../relation';
import { BoxInterface } from './BoxInterface';

const generateId = getIdGenerator();

export class Box extends DimensionsRectangle implements BoxInterface {
  private _id = generateId();

  public get id() {
    return this._id;
  }

  public content = '';
  public relations: RelationInterface[] = [];
}
