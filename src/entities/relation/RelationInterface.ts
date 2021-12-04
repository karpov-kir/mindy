import { BoxInterface } from '../box';

export type RelationInterface = {
  id: number;
  fromBox: BoxInterface;
  toBox: BoxInterface;
};
