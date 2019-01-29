import { hierarchy, partition } from "d3-hierarchy";
import memoizeOne from "memoize-one";

function getTree(data) {
  const root = {
    name: data.name,
    children: []
  };

  function addNode(parent, node) {
    let child;

    if (node.size) {
      child = { name: node.name, size: node.size };
    } else {
      child = { name: node.name, children: [] };
    }

    parent.children.push(child);

    if (node.children) {
      node.children.forEach(next => {
        addNode(child, next)
      })
    }
  }

  data.children.forEach(child => {
    addNode(root, child);
  })

  const tree = hierarchy(root)
    .sum(d => d.size || 0)
    .sort((a, b) => b.value - a.value);

  partition()(tree);

  tree.each(d => {
    d.filePath = d
      .path(tree)
      .reverse()
      .map(n => n.data.name)
      .join("/");
  });

  return tree;
}

export default memoizeOne(getTree);
