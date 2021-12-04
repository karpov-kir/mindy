import { getIdGenerator } from '../../utils';
import { BoxInterface } from '../box';
import { RelationInterface } from './RelationInterface';

const generateId = getIdGenerator();

export class Relation implements RelationInterface {
  private _id = generateId();

  public get id() {
    return this._id;
  }

  public fromBox: BoxInterface;
  public toBox: BoxInterface;

  constructor(fromBox: BoxInterface, toBox: BoxInterface) {
    this.fromBox = fromBox;
    this.toBox = toBox;
  }
}
