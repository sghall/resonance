// @flow weak

const jsdom = require('jsdom');

const makeKey = (attr) => {
  return attr.split(/[-:]/).map((s, i) => {
    return i === 0 ? s : s[0].toUpperCase() + s.slice(1);
  }).join('');
};

const EXCLUDE = [
  'class',
  'color',
  'height',
  'id',
  'lang',
  'max',
  'media',
  'method',
  'min',
  'name',
  'style',
  'target',
  'type',
  'width',
];

jsdom.env({
  url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute',
  done(err, window) {
    const all =
      [].slice.call(window.document.querySelector('#wikiArticle > div')
        .querySelectorAll('li a'))
        .map((a) => a.textContent)
        .filter((attr) => EXCLUDE.indexOf(attr) === -1)
        .sort();

    let attrs = '';
    let names = '';

    all.forEach((attr) => {
      const key = makeKey(attr);

      let val = '0';

      if (key !== attr || attr !== attr.toLowerCase()) {
        val = `'${attr}'`;
      }
      attrs += `${key}: ${val},\n`;
      if (key !== attr || key !== key.toLowerCase()) {
        names += `${key}: '${attr}',\n`;
      }
    });

    console.log(attrs, '\n\n\n', names); // eslint-disable-line no-console
  },
});
