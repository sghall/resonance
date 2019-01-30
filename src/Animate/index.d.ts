import * as React from "react";
import {
  Transition,
  TransitionFunction,
  PlainObject,
  PlainObjectFunction,
} from '../core';
import { GetInterpolator } from '..'

export interface IAnimateProps {
  wrapper?: string;
  wrapperClass?: string;
  wrapperStyles?: object;
  show?: boolean;
  interpolation: GetInterpolator;
  start: PlainObjectFunction | PlainObject;
  enter?: TransitionFunction | Transition | Array<Transition>
  update?: TransitionFunction | Transition | Array<Transition>
  leave?: TransitionFunction | Transition | Array<Transition>
  children: React.ReactElement<any>;
}

declare class IAnimate extends React.Component<IAnimateProps> { }

export default IAnimate;
