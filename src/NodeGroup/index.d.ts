import * as React from "react";
import {
  Transition,
  PlainObject,
} from '../core';
import { GetInterpolator } from '..'

export interface INodeGroupProps {
  wrapper?: string;
  wrapperClass?: string;
  wrapperStyle?: object;
  data: Array<any>;
  keyAccessor: (data: any, index: number) => string | number;
  interpolation: (begValue?: any, endValue?: any, attr?: string, namespace?: string) => (t: number) => any
  start: (data: any, index: number) => PlainObject;
  enter?: (data: any, index: number) => Transition | Array<Transition>;
  update?: (data: any, index: number) => Transition | Array<Transition>;
  leave?: (data: any, index: number) => Transition | Array<Transition>;
  children: React.ReactElement<any>;
}

declare class INodeGroup extends React.Component<INodeGroupProps> { }

export default INodeGroup
