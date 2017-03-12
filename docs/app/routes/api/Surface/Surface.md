Surface
=======

A piece of material Surface.

```js
import Surface from 'resonance/Surface';

const Component = () => <Surface zDepth={8}>Hello World</Surface>;
```

Props
-----

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| children | node |  | The CSS class name of the root element. |
| className | string |  | The CSS class name of the root element. |
| trbl | array | [10, 10, 10, 10] | Shadow depth, corresponds to `dp` in the spec. |
| view | array | [1000, 250] | Set to false to disable rounded corners. |

Any other properties supplied will be spread to the root element.
