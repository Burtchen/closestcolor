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

        const sortString = this.props.hasReferenceColor ? "by proximity to your reference color" : "in their original order";

        return (
            <section className="sub-section center-content">We found <strong>{this.props.colors}</strong> unique {colorString} in <strong>{inputString}</strong>. They are sorted {sortString}.</section>
        );
    }
}