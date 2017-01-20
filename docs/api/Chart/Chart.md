Chart
=====

Material chart wrapper.

```js
import Chart from 'material-ui/Chart';

const Component = () => <Chart zDepth={8}>Hello World</Chart>;
```

Props
-----

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| className | string |  | The CSS class name of the root element. |
| rounded | bool | true | Set to false to disable rounded corners. |
| zDepth | number | 2 | Shadow depth, corresponds to `dp` in the spec. |

Any other properties supplied will be spread to the root element.
