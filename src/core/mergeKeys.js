// @flow weak;
// Based on react-motion's mergeDiff (https://github.com/chenglou/react-motion)

function mergeKeys(currNodeKeys, currKeyIndex, nextNodeKeys, nextKeyIndex) {
  return currNodeKeys.concat(nextNodeKeys).sort((a, b) => {
    const nextOrderA = nextKeyIndex[a];
    const nextOrderB = nextKeyIndex[b];
    const currOrderA = currKeyIndex[a];
    const currOrderB = currKeyIndex[b];

    if (nextOrderA != null && nextOrderB != null) {
      return nextKeyIndex[a] - nextKeyIndex[b];
    } else if (currOrderA != null && currOrderB != null) {
      return currKeyIndex[a] - currKeyIndex[b];
    } else if (nextOrderA != null) {
      for (let i = 0; i < nextNodeKeys.length; i++) {
        const pivot = nextNodeKeys[i];

        if (!currKeyIndex[pivot]) {
          continue; // eslint-disable-line no-continue
        }
        if (
          nextOrderA < nextKeyIndex[pivot] &&
          currOrderB > currKeyIndex[pivot]
        ) {
          return -1;
        } else if (
          nextOrderA > nextKeyIndex[pivot] &&
          currOrderB < currKeyIndex[pivot]
        ) {
          return 1;
        }
      }

      return 1;
    }

    for (let i = 0; i < nextNodeKeys.length; i++) {
      const pivot = nextNodeKeys[i];

      if (!currKeyIndex[pivot]) {
        continue; // eslint-disable-line no-continue
      }

      if (
        nextOrderB < nextKeyIndex[pivot] &&
        currOrderA > currKeyIndex[pivot]
      ) {
        return 1;
      } else if (
        nextOrderB > nextKeyIndex[pivot] &&
        currOrderA < currKeyIndex[pivot]
      ) {
        return -1;
      }
    }

    return -1;
  });
}

export default mergeKeys;

