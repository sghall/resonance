import React, { Component } from 'react'
import SunBurst from './Sunburst'
import data from './data'

class Example extends Component {
  render() {
    return <SunBurst data={data} />
  }
}

export default Example
