var React = require('react');
var ReactDOM = require('react-dom');

export class ColorPaletteItem extends React.Component {

    getColorDifferenceText(colorDifference) {
        if (colorDifference < 0.5) {
            return "No or insignificant difference";
        }

        if (colorDifference < 2.3) {
            return "Imperceptible difference";
        }

        if (colorDifference < 5) {
            return "Noticable difference"
        }

        if (colorDifference < 10) {
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
        const colorDifference = this.props.colorDifference ?
            <span className="closest-color-palette-item-info"> {String.fromCharCode(916)}E: {this.props.colorDifference}</span>
            : null;
        const colorDifferenceText = typeof this.props.colorDifference === "number" ?
            this.getColorDifferenceText(this.props.colorDifference)
            : null;
        const referenceColorNote = this.props.referenceColor ?
            <div className="closest-color-palette-reference-color-headline"> Your reference color</div>:
            null;

        return (
            <div className={colorPaletteClass} style={colorPaletteItemStyle}>
                <div className="closest-color-palette-item-content center-content">
                    <span className="closest-color-palette-item-info">
                        {referenceColorNote}
                        {this.props.cssName}
                    </span>
                    <span className="closest-color-palette-item-info">
                        {this.props.variableName}
                    </span>
                </div>
                {colorDifference}
                {colorDifferenceText}
            </div>
        );
    }
}