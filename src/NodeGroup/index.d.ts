import * as React from "react";
import {
  Config,
  HashMap,
} from 'kapellmeister';
import { GetInterpolator } from '..'

export interface INodeGroupProps {
  wrapper?: string;
  wrapperClass?: string;
  wrapperStyle?: object;
  data: Array<any>;
  keyAccessor: (data: any, index: number) => string | number;
  interpolation?: GetInterpolator;
  start: (data: any, index: number) => HashMap;
  enter?: (data: any, index: number) => (Config | Array<Config>);
  update?: (data: any, index: number) => (Config | Array<Config>);
  leave?: (data: any, index: number) => (Config | Array<Config>);
  children: React.ReactElement<any>;
}

declare class INodeGroup extends React.Component<INodeGroupProps> { }

export default INodeGroup
