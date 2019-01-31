import * as React from "react";
import {
  Config,
  HashMap
} from 'kapellmeister';
import { GetInterpolator } from '..'

export interface IAnimateProps {
  wrapper?: string;
  wrapperClass?: string;
  wrapperStyles?: object;
  show?: boolean;
  interpolation: GetInterpolator;
  start: () => HashMap | HashMap;
  enter?: () => (Config | Array<Config>) | Config | Array<Config>;
  update?: () => (Config | Array<Config>) | Config | Array<Config>;
  leave?: () => (Config | Array<Config>) | Config | Array<Config>;
  children: React.ReactElement<any>;
}

declare class IAnimate extends React.Component<IAnimateProps> { }

export default IAnimate;
