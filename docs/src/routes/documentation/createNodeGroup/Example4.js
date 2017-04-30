// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { easeExpInOut } from 'd3-ease';
import { scaleBand } from 'd3-scale';
import { shuffle } from 'd3-array';

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 350];       // [width, height]
const trbl = [200, 20, 50, 20]; // [top, right, bottom, left] margins

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
class Circle extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    g: {
      opacity: 1e-6,
      transform: 'translate(0,0)',
    },
    circle: {
      r: 1e-6,
      strokeWidth: 1e-6,
      fill: 'green',
    },
  }

  onEnter() {
    const { data: { name }, scale } = this.props;

    return {
      g: {
        opacity: [0.4],
        transform: [`translate(${scale(name) + (scale.bandwidth() / 2)},0)`],
      },
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        strokeWidth: [(this.props.index + 1) * 2],
        fill: 'green',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onUpdate() {
    const { scale, index, data: { name } } = this.props;

    return {
      g: {
        opacity: [0.4],
        transform: [`translate(${scale(name) + (scale.bandwidth() / 2)},0)`],
      },
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        strokeWidth: [(index + 1) * 2],
        fill: 'blue',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onExit = () => ({
    g: {
      opacity: [1e-6],
    },
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: this.props.remove },
  })

  render() {
    return (
      <g {...this.state.g}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...this.state.circle}
        />
        <text
          x="0"
          y="20"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`x: ${this.state.g.transform}`}</text>
        <text
          x="0"
          y="5"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`name: ${this.props.data.name}`}</text>
      </g>
    );
  }
}

const Wrapper = (props) => { // Custom component wrapper
  return (
    <g>
      {props.children}
    </g>
  );
};

Wrapper.propTypes = {
  children: PropTypes.any,
};

const CircleGroup = createNodeGroup(Circle, Wrapper, (d) => d.name);

// **************************************************
//  Example
// **************************************************
class Example extends PureComponent {
  constructor(props) {
    super(props);

    (this:any).update = this.update.bind(this);
  }

  state = {
    data: shuffle(data).slice(0, Math.floor(Math.random() * ((data.length + 2) - (5 + 1))) + 5),
  }

  update() {
    this.setState({
      data: shuffle(data).slice(0, Math.floor(Math.random() * ((data.length + 2) - (5 + 1))) + 5),
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

export default Example;
