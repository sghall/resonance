import memoizeOne from 'memoize-one'

function getArcs(xScale, tree) {
  tree.each(d => {
    const a0 = n => Math.max(0, Math.min(2 * Math.PI, xScale(n.x0)))
    const a1 = n => Math.max(0, Math.min(2 * Math.PI, xScale(n.x1)))

    const angle = a1(d) - a0(d)
    const noTransition = d.angle === 0 && angle === 0

    d.angle = angle
    d.noTransition = noTransition
  })

  return tree.descendants().map(arc => {
    const { x0, x1, y0, y1, value, angle, depth, filePath, noTransition } = arc

    return {
      x0,
      x1,
      y0,
      y1,
      value,
      angle,
      depth,
      filePath,
      noTransition
    }
  })
}

export default memoizeOne(getArcs)
