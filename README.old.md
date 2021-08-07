# ClosestColor
ClosestColor lets you visualize your existing color palette and then find the closest color within the palette to a given reference color.

Give it a try: [ClosestColor.com](http://closestcolor.com).

Idea and Programming: Christian [Burtchen](https://www.twitter.com/burtchen). Initial Design: [@fox](https://www.twitter.com/fox).

Licensed under MIT.

## How this works
Start by either importing your existing CSS/SCSS files or by typing/pasting your CSS (or even just the colors!) in the textarea. Or both. Closest color supports CSS names, three and six letter hex values, RGB(A) and HSL(A) notation.

Your palette is then visualized, you can change whether color names appear the way they were originally entered (which might be a mix of hex and names, for instance), or streamline them into one common representation.

In order to compare the color you might have to, but actually don't want to add your CSS, type it in small central input field and hit "compare colors". Afterwards, the colors are sorted by proximity using the [CIE94](https://en.wikipedia.org/wiki/Color_difference) implementation. The color difference Delta E is shown within each color palette item.

That's it! Also, there's no tracking and no server-side storing of any of your input.

While ClosestColor supports SCSS input to read variable names, at the moment there is no support for color functions such as darkening.

I hope you like using and finding the closest color!