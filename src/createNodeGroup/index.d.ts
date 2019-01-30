import * as React from "react";
import {
  Transition,
  PlainObject,
} from '../core';
import { GetInterpolator } from '..'

export interface INodeGroupProps {
  wrapper?: string;
  wrapperClass?: string;
  wrapperStyles?: object;
  data: Array<any>;
  keyAccessor: (data: any, index: number) => string | number;
  start: (data: any, index: number) => PlainObject;
  enter?: (data: any, index: number) => Transition | Array<Transition>;
  update?: (data: any, index: number) => Transition | Array<Transition>;
  leave?: (data: any, index: number) => Transition | Array<Transition>;
  children: React.ReactElement<any>;
}

export declare class INodeGroup extends React.Component<INodeGroupProps> { }

export default function createNodeGroup(func: GetInterpolator, displayName?: string): typeof INodeGroup;
