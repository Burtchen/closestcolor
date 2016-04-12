var React = require('react');
var ReactDOM = require('react-dom');

export class ColorPaletteItem extends React.Component {

    render() {
        const backgroundColor = "rgb(" + this.props.red + "," + this.props.green + "," + this.props.blue + ")";
        const colorPaletteItemStyle = {
            backgroundColor: backgroundColor
        };
        let colorPaletteClass = "closest-color-palette-item";
        if (this.props.lightness > 75) {
            colorPaletteClass += " closest-color-palette-item-dark-text";
        }
        const colorDifference = this.props.colorDifference ?
            <span className="closest-color-palette-item-info">Difference: {this.props.colorDifference}</span>
            : null;
        //TODO: Place colorDifference text below

        return (
            <div className={colorPaletteClass} style={colorPaletteItemStyle}>
                <div className="closest-color-palette-item-content center-content">
                    <span className="closest-color-palette-item-info">
                        {this.props.cssName}
                    </span>
                    <span className="closest-color-palette-item-info">
                        {this.props.variableName}
                    </span>
                </div>
            </div>
        );
    }
}