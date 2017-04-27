// @flow weak

let id = 0;

export function newId() {
  return ++id;
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

// from https://github.com/d3/d3-ease/blob/master/src/cubic.js
export function easeCubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2; // eslint-disable-line
}

export function getRemoveUDID(keyAccessor) {
  const removeUDID = (udid) => {
    this.setState((prevState, props) => {
      const index0 = prevState.nodes.findIndex((d) => keyAccessor(d) === udid);
      const index1 = props.data.findIndex((d) => keyAccessor(d) === udid);

      if (index0 >= 0 && index1 === -1) {
        const udids = Object.assign({}, prevState.udids);
        delete udids[udid];

        return {
          udids,
          nodes: [
            ...prevState.nodes.slice(0, index0),
            ...prevState.nodes.slice(index0 + 1),
          ],
        };
      }

      return prevState;
    });
  };

  return removeUDID;
}
