// @flow weak

export function kebabCase(string) {
  return string.split(/ |_|-/)
    .join('-')
    .split('')
    .map((a, i) => {
      if (a.toUpperCase() === a && a !== '-') {
        return (i !== 0 ? '-' : '') + a.toLowerCase();
      }
      return a;
    })
    .join('')
    .toLowerCase();
}

export function titleize(string) {
  if (string.length <= 3) {
    return string.toUpperCase();
  }

  return string.split('-')
    .map((word) => word.split(''))
    .map((letters) => {
      const first = letters.shift();
      return [first.toUpperCase(), ...letters].join('');
    })
    .join(' ');
}

export function getSortByKey(key, ascending) {
  return function sort(a, b) {
    let result = 0;

    if (a[key] > b[key]) {
      result = ascending ? 1 : -1;
    }

    if (a[key] < b[key]) {
      result = ascending ? -1 : 1;
    }

    return result;
  };
}
