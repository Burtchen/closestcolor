var React = require('react');
var ReactDOM = require('react-dom');

export class ColorAnalysisText extends React.Component {

    render() {
        const colorString = this.props.colors > 1 ? "colors" : "color";
        let inputString;
        if (!this.props.textfieldContent && this.props.fileInformation) {
            if (typeof this.props.fileInformation === "number") {
                inputString = this.props.fileInformation + " CSS files";
            } else {
                inputString = this.props.fileInformation;
            }
        } else {
            inputString = "the CSS input";
        }

        return (
            <div>We found <strong>{this.props.colors}</strong> unique {colorString} in <strong>{inputString}</strong>.</div>
        );
    }
}