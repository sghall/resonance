
const REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

export function kebabCase(str) {
  return str.replace(REGEX, function(match) {
    return '-' + match.toLowerCase()
  })
}

export function numeric(beg, end) {
  const a = +beg
  const b = +end - a
  
  return function(t) {
    return a + b * t
  } 
}