const colorConvert = require('color-convert');
const cssColorList = require('css-color-list');
const cssColorNames = cssColorList();

export default function getColorValues(searchString) {
    const originalValue = searchString.toLowerCase();
    const variablePattern = "((\\$|--)\\w+\\S*:\\s*)?";

    //TODO: Maybe not build the regular expressions every time function is called?

    const threeLetterHexPattern = "#(\\d|(a|b|c|d|e|f)){3}(\$|;|\\s)";
    const threeLetterHexRegex = new RegExp(variablePattern + threeLetterHexPattern, "g");
    const threeLetterHexValues = originalValue.match(threeLetterHexRegex);

    const sixLetterHexPattern = "#(\\d|(a|b|c|d|e|f)){6}(\$|;|\\s)";
    const sixLetterHexRegex = new RegExp(variablePattern + sixLetterHexPattern, "g");
    let sixLetterHexValues = originalValue.match(sixLetterHexRegex);

    const shortRgbPattern = "^\\d{1,3},\\s?\\d{1,3},\\s?\\d{1,3}($|;|\\s)";
    const shortRgbRegex = new RegExp(variablePattern + shortRgbPattern, "g");
    const shortRgbValues = originalValue.match(shortRgbRegex);

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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: cssColorName
            });
        }
    });

    if (shortRgbValues !== null) {
        shortRgbValues.forEach((shortRgbValueString) => {
            const valueComponents = shortRgbValueString.split(",");
            const red = parseInt(valueComponents[0], 10);
            const green = parseInt(valueComponents[1], 10);
            const blue = parseInt(valueComponents[2], 10);
            const lab = colorConvert.rgb.lab(red, green, blue);
            extractedColors.push({
                red: red,
                green: green,
                blue: blue,
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName("rgb(" + red + "," + green + ","  + blue + ")"),
                variableName: getVariableName("rgb(" + red + "," + green + ","  + blue + ")")
            });
        });
    }

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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName(rgbValueString, offset),
                variableName: getVariableName(rgbValueString, offset)
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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName(rgbaValueString, offset),
                variableName: getVariableName(rgbaValueString, offset)
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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName(hslValueString, offset),
                variableName: getVariableName(hslValueString, offset)
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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName(hslaValueString, offset),
                variableName: getVariableName(hslaValueString, offset)
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
                L: lab[0],
                A: lab[1],
                B: lab[2],
                cssName: getCssName(sixLetterHexValue, offset),
                variableName: getVariableName(sixLetterHexValue, offset)
            });
        });
    }

    return extractedColors;
}

function getCssName(fullCssString, offset) {
    if (offset > 1) {
        return fullCssString.substring(fullCssString.indexOf(":") + 1).replace(";", "").trim();
    }
    return fullCssString.replace(";", "").trim();
}

function getVariableName(fullCssString, offset) {
    if (offset > 1) {
        return fullCssString.substring(0, fullCssString.indexOf(":"));
    }
    return null;
}