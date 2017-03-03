// @flow weak

const keyToString = (d, prefix = '') => `${prefix}${d}`;

const defaultKeyAccessor = (d, i) => {
  if (typeof d === 'number' || typeof d === 'string') {
    return keyToString(d, 'key-');
  } else if (d.id) {
    return keyToString(d.id);
  } else if (d.udid) {
    return keyToString(d.udid);
  }

  return keyToString(i, 'key-');
};

export default defaultKeyAccessor;
