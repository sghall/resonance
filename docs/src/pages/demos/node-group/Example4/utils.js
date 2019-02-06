import { format } from 'd3-format'

export const view = [500, 400]        // ViewBox: Width, Height
export const trbl = [30, 20, 10, 30]  // Margins: Top, Right, Bottom, Left

export const dims = [
  view[0] - trbl[1] - trbl[3],  // Adjusted dimensions width
  view[1] - trbl[0] - trbl[2],  // Adjusted dimensions height
]

export const percentFormat = format('.1%')

export function getSortByKey(key, ascending) {
  return function sort(a, b) {
    let result = 0

    if (a[key] > b[key]) {
      result = ascending ? 1 : -1
    }

    if (a[key] < b[key]) {
      result = ascending ? -1 : 1
    }

    return result
  }
}

