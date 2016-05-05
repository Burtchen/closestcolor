var React = require('react');
var ReactDOM = require('react-dom');

const colorConvert = require('color-convert');

export class ColorPaletteItem extends React.Component {

    get displayedColorName() {
        if (this.props.colorDisplayValue === "original") {
            return this.props.cssName
        }

        if (this.props.colorDisplayValue === "rgb") {
            return "rgb(" + this.props.red + "," + this.props.green + "," + this.props.blue + ")";
        }

        if (this.props.colorDisplayValue === "hsl") {
            return "hsl(" + colorConvert.rgb.hsl(this.props.red, this.props.green, this.props.blue).join(",") + ")";
        }

        if (this.props.colorDisplayValue === "hex") {
            return "#" + colorConvert.rgb.hex(this.props.red, this.props.green, this.props.blue);
        }
    }

    get colorDifferenceText() {
        if (this.props.colorDifference < 0.5) {
            return "No or insignificant difference";
        }

        if (this.props.colorDifference < 2.3) {
            return "Imperceptible difference";
        }

        if (this.props.colorDifference < 5) {
            return "Noticable difference"
        }

        if (this.props.colorDifference < 10) {
            return "Highly noticable difference"
        }

        return "Different color"
    }

    render() {
        const backgroundColor = "rgb(" + this.props.red + "," + this.props.green + "," + this.props.blue + ")";
        const colorPaletteItemStyle = {
            backgroundColor: backgroundColor
        };
        let colorPaletteClass = "closest-color-palette-item";
        if (this.props.lightness > 75) {
            colorPaletteClass += " closest-color-palette-item-dark-text";
        }
        if (this.props.referenceColor) {
            colorPaletteClass += " closest-color-palette-reference-item";
        }
        const colorDifference = typeof this.props.colorDifference === "number" ?
            <div className="closest-color-palette-reference-color-headline center-content"> {String.fromCharCode(916)}E: {this.props.colorDifference}</div>
            : null;
        const colorDifferenceText = typeof this.props.colorDifference === "number" ? this.colorDifferenceText : null;
        const referenceColorNote = this.props.referenceColor ?
            <div className="closest-color-palette-reference-color-headline"> Your reference color</div>:
            null;

        const cssName = this.displayedColorName;

        return (
            <div className={colorPaletteClass} style={colorPaletteItemStyle}>
                <div className="closest-color-palette-item-content center-content">
                    <span className="closest-color-palette-item-info">
                        {referenceColorNote}
                        {cssName}
                    </span>
                    <span className="closest-color-palette-item-info">
                        {this.props.variableName}
                    </span>
                </div>
                {colorDifference}
            </div>
        );
    }
}