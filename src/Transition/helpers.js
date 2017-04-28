// @flow weak

export function dedupe(...arrs) {
  const allItems = arrs.reduce((a, b) => a.concat(b), []);

  for (let i = 0; i < allItems.length; ++i) {
    for (let j = i + 1; j < allItems.length; ++j) {
      if (allItems[i] === allItems[j]) {
        allItems.splice(j--, 1);
      }
    }
  }
  return allItems;
}

// Taken from react-motion's mergeDiff (https://github.com/chenglou/react-motion/blob/446a8d0130072c4a59fec1ab788bfc2cc5c5b788/src/mergeDiff.js)
export function mergeItems(prev, next) {
  const prevKeyIndex = {};
  for (let i = 0; i < prev.length; i++) {
    prevKeyIndex[prev[i].key] = i;
  }
  const nextKeyIndex = {};
  for (let i = 0; i < next.length; i++) {
    nextKeyIndex[next[i].key] = i;
  }
  // Merge the arrays
  const allItems = [];
  for (let i = 0; i < next.length; i++) {
    allItems[i] = next[i];
  }
  for (let i = 0; i < prev.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(nextKeyIndex, prev[i].key)) {
      allItems.push(prev[i]);
    }
  }
  // now all the items all present. Core sorting logic to have the right order
  return allItems.sort((a, b) => {
    const nextOrderA = nextKeyIndex[a.key];
    const nextOrderB = nextKeyIndex[b.key];
    const prevOrderA = prevKeyIndex[a.key];
    const prevOrderB = prevKeyIndex[b.key];
    if (nextOrderA != null && nextOrderB != null) {
      // both keys in next
      return nextKeyIndex[a.key] - nextKeyIndex[b.key];
    } else if (prevOrderA != null && prevOrderB != null) {
      // both keys in prev
      return prevKeyIndex[a.key] - prevKeyIndex[b.key];
    } else if (nextOrderA != null) {
      // key a in next, key b in prev
      // how to determine the order between a and b? We find a "pivot" (term
      // abuse), a key present in both prev and next, that is sandwiched between
      // a and b. In the context of our above example, if we're comparing a and
      // d, b's (the only) pivot
      for (let i = 0; i < next.length; i++) {
        const pivot = next[i].key;

        if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
          continue; // eslint-disable-line no-continue
        }
        if (
          nextOrderA < nextKeyIndex[pivot] && prevOrderB > prevKeyIndex[pivot]
        ) {
          return -1;
        } else if (
          nextOrderA > nextKeyIndex[pivot] && prevOrderB < prevKeyIndex[pivot]
        ) {
          return 1;
        }
      }
      // pluggable. default to: next bigger than prev
      return 1;
    }
    // prevOrderA, nextOrderB
    for (let i = 0; i < next.length; i++) {
      const pivot = next[i].key;

      if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
        continue; // eslint-disable-line no-continue
      }
      if (
        nextOrderB < nextKeyIndex[pivot] && prevOrderA > prevKeyIndex[pivot]
      ) {
        return 1;
      } else if (
        nextOrderB > nextKeyIndex[pivot] && prevOrderA < prevKeyIndex[pivot]
      ) {
        return -1;
      }
    }
    // pluggable. default to: next bigger than prev
    return -1;
  });
}
