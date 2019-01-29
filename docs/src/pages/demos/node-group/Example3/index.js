import React, { Component } from 'react'
import Sunburst from './Sunburst'
import data from './data'

class Example extends Component {
  render() {
    return (
      <Sunburst data={data} />
    )
  }
}

export default Example
