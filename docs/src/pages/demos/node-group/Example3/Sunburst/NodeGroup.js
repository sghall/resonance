import { createNodeGroup } from 'resonance'

const numeric = (beg, end) => {
  const a = +beg
  const b = +end - a

  return function(t) {
    return a + b * t
  }
}

function getInterpolator(begValue, endValue) {
  return numeric(begValue, endValue)
}

export default createNodeGroup(getInterpolator)
