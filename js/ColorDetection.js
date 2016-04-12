const colorConvert = require('color-convert');
const cssColorList = require('css-color-list');
const cssColorNames = cssColorList();

export default function getColorValues(searchString) {
    const originalValue = searchString.toLowerCase();
    const variablePattern = "(\\$\\w+\\S*:\\s)?"; //TODO: Check space after variable

    //TODO: Maybe not build the regular expressions every time function is called?

    const threeLetterHexPattern = "#(\\d|(a|b|c|d|e|f)){3}(\$|;|\\s)";
    const threeLetterHexRegex = new RegExp(variablePattern + threeLetterHexPattern, "g");
    const threeLetterHexValues = originalValue.match(threeLetterHexRegex);

    const sixLetterHexPattern = "#(\\d|(a|b|c|d|e|f)){6}(\$|;|\\s)";
    const sixLetterHexRegex = new RegExp(variablePattern + sixLetterHexPattern, "g");
    let sixLetterHexValues = originalValue.match(sixLetterHexRegex);

    const rgbPattern = "(rgb\\(\\d{1,3}%?,\\s?\\d{1,3}%?,\\s?\\d{1,3}%?\\))($|;|\\s)";
    const rgbRegex = new RegExp(variablePattern + rgbPattern, "g");
    const rgbValues = originalValue.match(rgbRegex);

    const rgbaPattern = "(rgba\\(\\d{1,3}%?,\\s?\\d{1,3}%?,\\s?\\d{1,3}%?\,\\s?\\d(\\.\\d)?\\))($|;|\\s)";
    const rgbaRegex = new RegExp(variablePattern + rgbaPattern, "g");
    const rgbaValues = originalValue.match(rgbaRegex);

    const hslPattern = "(hsl\\(\\d{1,3},\\s?\\d{1,3}%,\\s?\\d{1,3}%\\))($|;|\\s)";
    const hslRegex = new RegExp(variablePattern + hslPattern, "g");
    const hslValues = originalValue.match(hslRegex);

    const hslaPattern = "(hsla\\(\\d{1,3},\\s?\\d{1,3}%,\\s?\\d{1,3}%,\\s?\\d(\\.\\d)?\\))($|;|\\s)";
    const hslaRegex = new RegExp(variablePattern + hslaPattern, "g");
    const hslaValues = originalValue.match(hslaRegex);

    let extractedColors = [];

    cssColorNames.forEach((cssColorName) => {
        // Technically not the most efficient, but the sanest way to do this rather than one evil regex.
        const cssColorNameRegex = new RegExp("(^|\\s)" + cssColorName + "($|;|\\s)", "g");
        if (originalValue.match(cssColorNameRegex)) {
            const rgb = colorConvert.keyword.rgb(cssColorName);
            const lab = colorConvert.keyword.lab(cssColorName);
            extractedColors.push({
                red: rgb[0],
                green: rgb[1],
                blue: rgb[2],
                lightness: lab[0],
                a: lab[1],
                b: lab[2],
                cssName: cssColorName
            });
        }
    });

    if (rgbValues !== null) {
        rgbValues.forEach((rgbValueString) => {
            const offset = rgbValueString.indexOf("rgb(");
            const valueComponents = rgbValueString.substring(offset).replace("rgb(", "").replace(")", "").split(",");
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
                b: lab[2],
                cssName: rgbValueString,
                variableName: offset > 1 ? rgbValueString.substring(0, rgbValueString.indexOf(":")) : null
            });
        });
    }

    if (rgbaValues !== null) {
        rgbaValues.forEach((rgbaValueString) => {
            const offset = rgbaValueString.indexOf("rgba(");
            const valueComponents = rgbaValueString.substring(offset).replace("rgba(", "").split(",");
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
                b: lab[2],
                cssName: rgbaValueString,
                variableName: offset > 1 ? rgbaValueString.substring(0, rgbaValueString.indexOf(":")) : null
            });
        });
    }

    if (hslValues !== null) {
        hslValues.forEach((hslValueString) => {
            const offset = hslValueString.indexOf("hsl(");
            const valueComponents = hslValueString.substring(offset).replace("hsl(", "").replace(")", "").split(",");
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
                b: lab[2],
                cssName: hslValueString,
                variableName: offset > 1 ? hslValueString.substring(0, hslValueString.indexOf(":")) : null
            });
        });
    }

    if (hslaValues !== null) {
        hslaValues.forEach((hslaValueString) => {
            const offset = hslaValueString.indexOf("hsla(");
            const valueComponents = hslaValueString.substring(offset).replace("hsla(", "").split(",");
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
                b: lab[2],
                cssName: hslaValueString,
                variableName: offset > 1 ? hslaValueString.substring(0, hslaValueString.indexOf(":")) : null
            });
        });
    }

    if (threeLetterHexValues !== null) {
        sixLetterHexValues = sixLetterHexValues || [];
        threeLetterHexValues.forEach((threeLetterHexValue) => {
            const offset = threeLetterHexValue.indexOf("#");
            sixLetterHexValues.push(threeLetterHexValue.substring(0, offset + 1) +
                threeLetterHexValue.charAt(offset + 1) + threeLetterHexValue.charAt(offset + 1) +
                threeLetterHexValue.charAt(offset + 2) + threeLetterHexValue.charAt(offset + 2) +
                threeLetterHexValue.charAt(offset + 3) + threeLetterHexValue.charAt(offset + 3)
            );
        });
    }

    if (sixLetterHexValues !== null) {
        sixLetterHexValues.forEach((sixLetterHexValue) => {
            const offset = sixLetterHexValue.indexOf("#");
            const sixLetterHexColor = sixLetterHexValue.substring(offset);
            const rgb = colorConvert.hex.rgb(sixLetterHexColor);
            const lab = colorConvert.hex.lab(sixLetterHexColor);
            extractedColors.push({
                red: rgb[0],
                green: rgb[1],
                blue: rgb[2],
                lightness: lab[0],
                a: lab[1],
                b: lab[2],
                cssName: sixLetterHexValue,
                variableName: offset > 1 ? sixLetterHexValue.substring(0, sixLetterHexValue.indexOf(":")) : null
            });
        });
    }

    return extractedColors;
}