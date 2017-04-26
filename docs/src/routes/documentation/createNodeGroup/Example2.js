// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { scaleBand, scaleLinear } from 'd3-scale';
import { shuffle, max } from 'd3-array';
import { easeBounce, easePoly } from 'd3-ease';

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
      value: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    opacity: 1e-6,
    x: 0,
    fill: 'green',
    width: this.props.xScale.bandwidth(),
    height: 0,
  }

  onEnter = () => ([  // An array!!
    {
      opacity: [0.6],
      width: [this.props.xScale.bandwidth()],
      height: [this.props.yScale(this.props.data.value)],
      timing: { duration: 1000 },
    },
    {
      x: [this.props.xScale(this.props.data.name)],
      timing: { duration: 100 * this.props.index, ease: easePoly },
    },
  ])

  onUpdate = () => ([  // An array!!
    {
      opacity: [0.6],
      fill: ['blue', 'grey'],
      timing: { duration: 2000 },
    },
    {
      x: [this.props.xScale(this.props.data.name)],
      timing: { duration: 2000, ease: easeBounce },
    },
    {
      width: [this.props.xScale.bandwidth()],
      timing: { duration: 500 },
    },
    {
      height: [this.props.yScale(this.props.data.value)],
      timing: { delay: 2000, duration: 500 },
      events: {
        end: () => {
          this.setState({ fill: 'steelblue' });
        },
      },
    },
  ])

  onExit = () => ({
    opacity: [1e-6],
    fill: 'red',
    timing: { duration: 1000 },
    events: { end: this.props.remove },
  })

  render() {
    const { x, height, ...rest } = this.state;

    return (
      <g transform={`translate(${x},0)`}>
        <rect
          y={height}
          height={dims[1] - height}
          {...rest}
        />
        <text
          x="0"
          y="20"
          fill="black"
          transform="rotate(90 5,20)"
        >{`x: ${x}`}</text>
      </g>
    );
  }
}

const BarGroup = createNodeGroup(Bar, 'g', (d) => d.name);

// **************************************************
//  Example
// **************************************************
class Example2 extends PureComponent {
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
    const xScale = scaleBand()
      .rangeRound([0, dims[0]])
      .domain(this.state.data.map((d) => d.name))
      .padding(0.1);

    const yScale = scaleLinear()
      .rangeRound([dims[1], 0])
      .domain([0, max(this.state.data.map((d) => d.value))]);

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
            xScale={xScale}
            yScale={yScale}
          />
        </Surface>
      </div>
    );
  }
}

export default Example2;
