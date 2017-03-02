// @flow weak

const defaultComposeNode = (data, type, udid) => {
  if (typeof data === 'number' || typeof data === 'string') {
    return { data, type, udid };
  }

  return { ...data, type, udid };
};

export default defaultComposeNode;
