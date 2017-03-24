## Surface

A basic svg container for visualizations.
Using the ***Surface*** component, the svg will scale to fit its container as the window size adjusts but maintain a constant aspect ratio (unless you update the view prop).
This is an alternative to using JavaScript listeners to update the svg's width and height in response to resize events.
Changing the width and height of the svg via JavaScript can be inefficient for complex visualizations.
Changing the aspect ratio also leads to distorted, inconsistent views of data at different window sizes.
There are, of course, pros and cons to the different methods and in some cases using JavaScript to resize the svg will be appropriate.

### Notes:

1. The outermost element is a div (not an svg element) with styles to make the contained svg scale correctly in most browsers.
You can augment the outer div styles by sending a style object. 

2. The div has an svg element as its only child. The svg, in turn, contains a single g element as it's child.

3. The g element is translated into position according to the margins you define in your trbl prop. See the examples below.

4. The child elements of the ***Surface*** will be placed inside of the translated g element.
This makes it easier to adjust your visualization for titles, axes, notes, etc (just adjust the trbl prop).
You can get a sense of how this works in the examples below.
