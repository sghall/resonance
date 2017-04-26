// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { easeExpInOut } from 'd3-ease';
import { scaleBand } from 'd3-scale';
import { shuffle } from 'd3-array';

const view = [1000, 350];      // [width, height]
const trbl = [50, 20, 50, 20]; // [top, right, bottom, left] margins

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
//  Circle Component
// **************************************************
class Circle extends Component {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    opacity: 1e-6,
    circle: {
      r: 1e-6,
      cx: this.props.scale(this.props.data.name) + (this.props.scale.bandwidth() / 2),
      strokeWidth: 1e-6,
      fill: 'green',
    },
  }

  onEnter = () => ({
    opacity: [0.4],
    circle: {
      r: [this.props.scale.bandwidth() / 2],
      strokeWidth: [(this.props.index + 1) * 2],
      fill: 'green',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })

  onUpdate() {
    const { scale, index, data: { name } } = this.props;

    return {
      opacity: [0.4],
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        cx: [scale(name) + (scale.bandwidth() / 2)],
        strokeWidth: [(index + 1) * 2],
        fill: 'blue',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onExit = () => ({
    opacity: [1e-6],
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: this.props.remove },
  })

  render() {
    return (
      <g opacity={this.state.opacity}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...this.state.circle}
        />
      </g>
    );
  }
}

const CircleGroup = createNodeGroup(Circle, 'g', (d) => d.name);

// **************************************************
//  Example
// **************************************************
class Example3 extends Component {
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
          Circle Count: {this.state.data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <CircleGroup
            data={this.state.data}
            scale={scale}
          />
        </Surface>
      </div>
    );
  }
}

export default Example3;
