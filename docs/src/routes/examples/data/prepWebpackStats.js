// @flow weak
/* eslint global-require: "off", import/no-absolute-path: "off" */

const stats = require('/Users/steve/Desktop/stats.json');
const fs = require('fs');

// from https://github.com/chrisbateman/webpack-visualizer/blob/master/src/shared/buildHierarchy.js
function getChild(arr, name) { // eslint-disable-line consistent-return
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === name) {
      return arr[i];
    }
  }
}

function getFile(module, fileName, parentTree) {
  const charIndex = fileName.indexOf('/');

  if (charIndex !== -1) {
    let folder = fileName.slice(0, charIndex);

    if (folder === '~') {
      folder = 'node_modules';
    }

    let childFolder = getChild(parentTree.children, folder);

    if (!childFolder) {
      childFolder = {
        name: folder,
        children: [],
      };

      parentTree.children.push(childFolder);
    }

    getFile(module, fileName.slice(charIndex + 1), childFolder);
  } else {
    module.name = fileName; // eslint-disable-line no-param-reassign
    parentTree.children.push(module);
  }
}

function buildHierarchy(modules) {
  let maxDepth = 1;

  const root = {
    children: [],
    name: 'root',
  };

  modules.forEach((module) => {
    const extractInIdentifier = module.identifier.indexOf('extract-text-webpack-plugin') !== -1;
    const extractInIssuer = module.issuer && module.issuer.indexOf('extract-text-webpack-plugin') !== -1;

    if (extractInIdentifier || extractInIssuer || module.index === null) {
      return;
    }

    const mod = {
      id: module.id,
      fullName: module.name,
      size: module.size,
    };

    const depth = mod.fullName.split('/').length - 1;

    if (depth > maxDepth) {
      maxDepth = depth;
    }

    let fileName = mod.fullName;

    const beginning = mod.fullName.slice(0, 2);

    if (beginning === './') {
      fileName = fileName.slice(2);
    }

    getFile(mod, fileName, root);
  });

  root.maxDepth = maxDepth;

  return root;
}

fs.writeFile('./wepack-stats.json', JSON.stringify(buildHierarchy(stats.modules), null, 4), 'utf-8', (err) => {
  if (err) {
    console.log('ERROR: ', err);
  } else {
    console.log('Saved Successfully!');
  }
});
