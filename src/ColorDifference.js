export default function colorDifference(comparedColor, referenceColor) {
    const deltaLightness = referenceColor.lightness - comparedColor.lightness;
    const deltaA = referenceColor.a - comparedColor.a;
    const deltaB = referenceColor.b - comparedColor.b;

    //const deltaE = Math.sqrt(Math.pow(deltaLightness, 2) + Math.pow(deltaA, 2) + Math.pow(deltaB, 2));

    const referenceChroma = Math.sqrt(Math.pow(referenceColor.a, 2) + Math.pow(referenceColor.b, 2));
    const compareChroma = Math.sqrt(Math.pow(comparedColor.a, 2) + Math.pow(comparedColor.b, 2));
    const deltaChroma = referenceChroma - compareChroma;
    const deltaHue = Math.sqrt(Math.pow(deltaA, 2) + Math.pow(deltaB, 2) + Math.pow(deltaChroma, 2));

    const k1 = 0.045;
    const k2 = 0.015;

    const deltaE94 = Math.sqrt(Math.pow(deltaLightness, 2) + Math.pow(deltaChroma / (1 + (k1 * referenceChroma)), 2) + Math.pow(deltaHue / (1 + (k2 * referenceChroma)), 2));
    return Math.round(deltaE94, 1);
}