// @flow weak

const defaultKeyAccessor = (d, i) => {
  if (typeof d === 'number' || typeof d === 'string') {
    return `key-${d}`;
  } else if (typeof d === 'object' && d !== null) {
    return JSON.stringify(d);
  }

  return `key-${i}`;
};

export default defaultKeyAccessor;
