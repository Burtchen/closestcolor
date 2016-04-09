const colorConvert = require('color-convert');
const cssColorList = require('css-color-list');
const cssColorNames = cssColorList();

export default function getColorValues(searchString) {
        const originalValue = searchString.toLowerCase();
        //TODO: Versions capturing SASS variables
        const threeLetterHexValues = originalValue.match(/#(\d|(a|b|c|d|e|f)){3}($|;|\s)/g);
        let sixLetterHexValues = originalValue.match(/#(\d|(a|b|c|d|e|f)){6}($|;|\s)/g);
        const rgbValues = originalValue.match(/(rgb\(\d{1,3}%?,\s?\d{1,3}%?,\s?\d{1,3}%?\))($|;|\s)/g);
        const hslValues = originalValue.match(/(hsl\(\d{1,3},\s?\d{1,3}%,\s?\d{1,3}%\))($|;|\s)/g);
        const rgbaValues = originalValue.match(/(rgba\(\d{1,3}%?,\s?\d{1,3}%?,\s?\d{1,3}%?,\s?\d(.\d)?\))($|;|\s)/g);
        const hslaValues = originalValue.match(/(hsla\(\d{1,3},\s?\d{1,3}%,\s?\d{1,3}%,\s?\d(.\d)?\))($|;|\s)/g);

        let extractedColors = [];

        cssColorNames.forEach((cssColorName) => {
            // Technically not the most efficient, but the sanest way to do this rather than one evil regex.
            const cssColorNameRegex = new RegExp("(^|\\s)" + cssColorName + "($|;|\\s)", "g"); //TODO: Matching SASS variable
            if (originalValue.match(cssColorNameRegex)) {
                const rgb = colorConvert.keyword.rgb(cssColorName);
                const lab = colorConvert.keyword.lab(cssColorName);
                extractedColors.push({
                    red: rgb[0],
                    green: rgb[1],
                    blue: rgb[2],
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            }
        });

        if (rgbValues !== null) {
            rgbValues.forEach((rgbValueString) => {
                const valueComponents = rgbValueString.replace("rgb(", "").replace(")", "").split(",");
                const red = valueComponents[0].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[0], 10) * 2.55) : parseInt(valueComponents[0], 10);
                const green = valueComponents[1].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[1], 10) * 2.55) : parseInt(valueComponents[1], 10);
                const blue = valueComponents[2].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[2], 10) * 2.55) :parseInt(valueComponents[2], 10);
                const lab = colorConvert.rgb.lab(red, green, blue);
                extractedColors.push({
                    red: red,
                    green: green,
                    blue: blue,
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            });
        }

        if (rgbaValues !== null) {
            rgbaValues.forEach((rgbaValueString) => {
                const valueComponents = rgbaValueString.replace("rgba(", "").split(",");
                const red = valueComponents[0].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[0], 10) * 2.55) : parseInt(valueComponents[0], 10);
                const green = valueComponents[1].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[1], 10) * 2.55) : parseInt(valueComponents[1], 10);
                const blue = valueComponents[2].indexOf("%") !== -1 ? Math.round(parseInt(valueComponents[2], 10) * 2.55) : parseInt(valueComponents[2], 10);
                const lab = colorConvert.rgb.lab(red, green, blue);
                extractedColors.push({
                    red: red,
                    green: green,
                    blue: blue,
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            });
        }

        if (hslValues !== null) {
            hslValues.forEach((hslValueString) => {
                const valueComponents = hslValueString.replace("hsl(", "").replace(")", "").split(",");
                const hue = parseInt(valueComponents[0], 10);
                const saturation = parseInt(valueComponents[1], 10);
                const lightness = parseInt(valueComponents[2], 10);
                const rgb = colorConvert.hsl.rgb(hue, saturation, lightness);
                const lab = colorConvert.hsl.lab(hue, saturation, lightness);
                extractedColors.push({
                    red: rgb[0],
                    green: rgb[1],
                    blue: rgb[2],
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            });
        }

        if (hslaValues !== null) {
            hslaValues.forEach((hslaValueString) => {
                const valueComponents = hslaValueString.replace("hsla(", "").split(",");
                const hue = parseInt(valueComponents[0], 10);
                const saturation = parseInt(valueComponents[1], 10);
                const lightness = parseInt(valueComponents[2], 10);
                const rgb = colorConvert.hsl.rgb(hue, saturation, lightness);
                const lab = colorConvert.hsl.lab(hue, saturation, lightness);
                extractedColors.push({
                    red: rgb[0],
                    green: rgb[1],
                    blue: rgb[2],
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            });
        }

        if (threeLetterHexValues !== null) {
            sixLetterHexValues = sixLetterHexValues || [];
            threeLetterHexValues.forEach((threeLetterHexValue) => {
                sixLetterHexValues.push(
                    threeLetterHexValue.charAt(1) + threeLetterHexValue.charAt(1) +
                    threeLetterHexValue.charAt(2) + threeLetterHexValue.charAt(2) +
                    threeLetterHexValue.charAt(3) + threeLetterHexValue.charAt(3)
                );
            });
        }

        if (sixLetterHexValues !== null) {
            sixLetterHexValues.forEach((sixLetterHexValue) => {
                const rgb = colorConvert.hex.rgb(sixLetterHexValue);
                const lab = colorConvert.hex.lab(sixLetterHexValue);
                extractedColors.push({
                    red: rgb[0],
                    green: rgb[1],
                    blue: rgb[2],
                    lightness: lab[0],
                    a: lab[1],
                    b: lab[2]
                });
            });
        }

        return extractedColors;
}