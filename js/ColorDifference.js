export default function colorDifference(comparedColor, referenceColor) {
    const deltaL = referenceColor.lightness - comparedColor.lightness;
    const deltaA = referenceColor.a - comparedColor.a;
    const deltaB = referenceColor.b - comparedColor.b;

    //const deltaE = Math.sqrt(Math.pow(deltaL, 2) + Math.pow(deltaA, 2) + Math.pow(deltaB, 2));

    const referenceChroma = Math.sqrt(Math.pow(referenceColor.a, 2) + Math.pow(referenceColor.b, 2));
    const compareChroma = Math.sqrt(Math.pow(comparedColor.a, 2) + Math.pow(comparedColor.b, 2));
    const deltaC = referenceChroma - compareChroma;
    const deltaHue = Math.sqrt(Math.pow(deltaA, 2) + Math.pow(deltaB, 2) + Math.pow(deltaC, 2));

    const deltaE94 = Math.sqrt(Math.pow(deltaL, 2) + Math.pow(deltaC / (1 + referenceChroma), 2) + Math.pow(deltaHue / (1 + compareChroma), 2));
    return Math.round(deltaE94, 1);
}