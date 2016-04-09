var React = require('react');
var ReactDOM = require('react-dom');

export class ColorPaletteItem extends React.Component {

    render() {
        const backgroundColor = "rgb(" + this.props.red + "," + this.props.green + "," + this.props.blue + ")";
        const colorPaletteItemStyle = {
            width: "40px",
            height: "40px",
            display: "inline-block",
            backgroundColor: backgroundColor
        };

        return (
            <div className="closest-color-palette-item" style={colorPaletteItemStyle}>
                {this.props.colorDifference}
            </div>
        );
    }
}