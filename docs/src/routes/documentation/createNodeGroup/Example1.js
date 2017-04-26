// @flow weak
/* eslint react/no-multi-comp: 'off' */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { scaleBand } from 'd3-scale';
import { shuffle } from 'd3-array';
import { easePoly } from 'd3-ease';

const view = [1000, 250];      // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// **************************************************
//  Data
// **************************************************
const data = [
  {
    name: 'Linktype',
    value: 45,
  }, {
    name: 'Quaxo',
    value: 53,
  }, {
    name: 'Skynoodle',
    value: 86,
  }, {
    name: 'Realmix',
    value: 36,
  }, {
    name: 'Jetpulse',
    value: 54,
  }, {
    name: 'Chatterbridge',
    value: 91,
  }, {
    name: 'Riffpedia',
    value: 67,
  }, {
    name: 'Layo',
    value: 12,
  }, {
    name: 'Oyoba',
    value: 69,
  }, {
    name: 'Ntags',
    value: 17,
  }, {
    name: 'Brightbean',
    value: 73,
  }, {
    name: 'Blogspan',
    value: 25,
  }, {
    name: 'Twitterlist',
    value: 73,
  }, {
    name: 'Rhycero',
    value: 67,
  }, {
    name: 'Trunyx',
    value: 52,
  }, {
    name: 'Browsecat',
    value: 90,
  }, {
    name: 'Skinder',
    value: 88,
  }, {
    name: 'Tagpad',
    value: 83,
  }, {
    name: 'Gabcube',
    value: 6,
  }, {
    name: 'Jabberstorm',
    value: 19,
  },
];

// **************************************************
//  Bar Component
// **************************************************
class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    scale: PropTypes.func.isRequired,  // prop passed down from NodeGroup
    remove: PropTypes.func.isRequired, // function passed down to each node
  }

  state = {
    opacity: 1e-6,
    x: 0,
    fill: 'green',
    width: 1e-6,
  }

  onEnter = () => ({
    opacity: [0.5],
    x: [this.props.scale(this.props.data.name)],
    width: [this.props.scale.bandwidth()],
    timing: { duration: 200 * this.props.index, delay: 1000 },
  })

  onUpdate = () => ({
    opacity: [0.5],
    x: [this.props.scale(this.props.data.name)],
    fill: 'blue',
    width: [this.props.scale.bandwidth()],
    timing: { duration: 1000, ease: easePoly },
  })

  onExit = () => ({
    opacity: [1e-6],
    x: [this.props.scale.range()[1]],
    fill: 'red',
    timing: { duration: 1000 },
    events: { end: this.props.remove },
  })

  render() {
    const { x, ...rest } = this.state;

    return (
      <g transform={`translate(${x},0)`}>
        <rect
          height={dims[1]}
          {...rest}
        />
        <text
          x="0"
          y="20"
          fill="white"
          transform="rotate(90 5,20)"
        >{`x: ${x}`}</text>
        <text
          x="0"
          y="5"
          fill="white"
          transform="rotate(90 5,20)"
        >{`name: ${this.props.data.name}`}</text>
      </g>
    );
  }
}

const BarGroup = createNodeGroup(Bar, 'g', (d) => d.name);

// **************************************************
//  Example
// **************************************************
class Example1 extends PureComponent {
  constructor(props) {
    super(props);
    (this:any).update = this.update.bind(this);
  }

  state = {
    data: shuffle(data).slice(0, Math.ceil(Math.random() * data.length)),
  }

  update() {
    this.setState({
      data: shuffle(data).slice(0, Math.ceil(Math.random() * data.length)),
    });
  }

  render() {
    const scale = scaleBand()
      .rangeRound([0, dims[0]])
      .domain(this.state.data.map((d) => d.name))
      .padding(0.1);

    return (
      <div>
        <button onClick={this.update}>
          Update
        </button>
        <span style={{ margin: 5 }}>
          Bar Count: {this.state.data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <BarGroup
            data={this.state.data}
            scale={scale}
          />
        </Surface>
      </div>
    );
  }
}

export default Example1;
