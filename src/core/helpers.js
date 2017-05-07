// @flow weak

let id = 0;

export function newId() {
  return ++id;
}

export function getRemoveUDID(keyAccessor) {
  const removeUDID = (udid) => {
    this.setState((prevState, props) => {
      const index0 = prevState.nodes
        .findIndex((d) => keyAccessor(d) === udid);

      const index1 = props.data
        .findIndex((d) => keyAccessor(d) === udid);

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
