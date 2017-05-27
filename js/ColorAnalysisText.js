var React = require('react');

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
            <section className="sub-section center-content">
                We found <strong>{this.props.colors}</strong> unique {colorString} in <strong>{inputString}</strong>. They are sorted {sortString}. <span className="no-wrap">Color values as
                <select name="color-display-selector" className="closest-color-select" defaultValue="original" onChange={this.props.handleColorDisplayChange}>
                    <option value="original">originally entered</option>
                    <option value="rgb">RGB</option>
                    <option value="hsl">HSL</option>
                    <option value="hex">Hex values</option>
                </select>
                {this.props.hasReferenceColor &&
                    <span> and
                        <select name="color-grouping-selector" className="closest-color-select" defaultValue={false} onChange={this.props.handleGroupChange}>
                            <option value={true}>grouped</option>
                            <option value={false}>ungrouped</option>
                        </select>
                    </span>
                }
                .</span>
                {!this.props.hasReferenceColor &&
                    <p>You can set a reference color by typing in the field above or clicking on one of your palette items.</p>
                }
            </section>
        );
    }
}