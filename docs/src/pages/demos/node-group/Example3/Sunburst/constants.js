export const VIEW = [500, 500] // ViewBox: Width, Height
export const TRBL = [80, 80, 80, 80] // Margins: Top, Right, Bottom, Left

export const DIMS = [
  VIEW[0] - TRBL[1] - TRBL[3], // Adjusted dimensions width
  VIEW[1] - TRBL[0] - TRBL[2] // Adjusted dimensions height
]

export const RADIUS = Math.min(...DIMS) / 2

export const PI = Math.PI