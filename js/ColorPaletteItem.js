var React = require('react');
var ReactDOM = require('react-dom');

const colorConvert = require('color-convert');

export class ColorPaletteItem extends React.Component {

    constructor(props) {
        super(props);
        this.askForReferenceColor = this.askForReferenceColor.bind(this);
    }

    askForReferenceColor() {
        if (this.props.referenceColor) {
            return;
        }
        this.props.setPaletteAsReferenceColor({
            cssName: this.props.cssName,
            red: this.props.red,
            green: this.props.green,
            blue: this.props.blue,
            L: this.props.L,
            A: this.props.A,
            B: this.props.B,
        });
    }

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
        let text = "With a " + String.fromCharCode(916) + "E of "  + this.props.colorDifference + ", there is ";
        if (this.props.colorDifference < 0.5) {
            text+= "no or a really insignificant difference. This color is absolutely safe to be replaced.";
        } else if (this.props.colorDifference < 2.3) {
            text+= "an imperceptible difference, this color can be safely replaced.";
        } else if (this.props.colorDifference < 5) {
            text+= "a potentially noticable difference, but unless the colors are adjacent, still a safe replacement."
        } else if (this.props.colorDifference < 10) {
            text+=  "a noticable difference especially in proxmity. Can probably not be safely replaced."
        } else {
            text+= "a massive difference. Not a suitable replacement.";
        }

        return text;
    }

    render() {
        const backgroundColor = "rgb(" + this.props.red + "," + this.props.green + "," + this.props.blue + ")";
        const colorPaletteItemStyle = {
            backgroundColor: backgroundColor
        };
        let colorPaletteClass = "closest-color-palette-item";
        if (this.props.L > 75) {
            colorPaletteClass += " closest-color-palette-item-dark-text";
        }
        if (this.props.referenceColor) {
            colorPaletteClass += " closest-color-palette-reference-item";
        }
        const colorDifference = typeof this.props.colorDifference === "number" ?
            <span><br/>{String.fromCharCode(916)}E: {this.props.colorDifference}</span>
            : null;
        const colorDifferenceText = typeof this.props.colorDifference === "number" ? this.colorDifferenceText : null;
        const referenceColorNote = this.props.referenceColor ?
            <div className="closest-color-palette-reference-color-headline"> Your reference color</div>:
            null;

        const cssName = this.displayedColorName;
        const variableName = this.props.variableName ? <span><br/>{this.props.variableName}</span> : null;

        return (
            <div className={colorPaletteClass} style={colorPaletteItemStyle} title={colorDifferenceText} onClick={this.askForReferenceColor}>
                <div className="closest-color-palette-item-content center-content">
                    <span className="closest-color-palette-item-info" ref="colorInfo">
                        {referenceColorNote}
                        {cssName}
                        {variableName}
                        {colorDifference}
                    </span>
                </div>
            </div>
        );
    }
}