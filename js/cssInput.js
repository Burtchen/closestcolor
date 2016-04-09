import {ColorPaletteItem} from './ColorPaletteItem'
import getColorValues from './ColorDetection'
import computeColorDifference from './ColorDifference'

const React = require('react');
const ReactDOM = require('react-dom');

const uniqBy = require('lodash/uniqBy');

export class Cssinput extends React.Component {
    constructor(props) {
        super(props);
        this.handleCssInput = this.handleCssInput.bind(this);
        this.handleReferenceColorInput = this.handleReferenceColorInput.bind(this);
        this.state = {
            colorPalette: [],
            referenceColor: null,
            moreThanOneReferenceColor: false
        }
    }

    handleReferenceColorInput() {
        const extractedColors = getColorValues(this.refs.referenceColorInput.value);
        if (extractedColors) {
            this.setState({
                referenceColor: extractedColors.length ? extractedColors[0] : null,
                moreThanOneReferenceColor: extractedColors.length > 1
            });
        }
    }

    handleCssInput() {
        let detectedColors = getColorValues(this.refs.cssInput.value) || [];
        detectedColors = uniqBy(detectedColors, (detectedColor) => {
            // cf. http://stackoverflow.com/a/26306963
            return [detectedColor.red, detectedColor.green, detectedColor.blue].join(" ");
        });

        this.setState({colorPalette: detectedColors});
    }

    render() {

        let colorPaletteItems = null;
        let colorAnalysisText = null;
        const referenceColorInputField = (<div>
            <input type="text" ref="referenceColorInput"
                   placeholder="Which color do you want to compare?"
                   onKeyUp={this.handleReferenceColorInput} onPaste={this.handleReferenceColorInput}/>
        </div>);
        const moreThanOneReferenceColorNote = this.state.moreThanOneReferenceColor ?
            <div>You entered more than one reference color. Don't do that.</div> : null;


        if (this.state.colorPalette.length > 0) {
            colorPaletteItems = this.state.colorPalette.map((colorPaletteItem) => {
                const colorDifference = this.state.referenceColor ? computeColorDifference(colorPaletteItem, this.state.referenceColor) : null;
                return <ColorPaletteItem {...colorPaletteItem} colorDifference={colorDifference}/>
            });
            colorAnalysisText = <div>We found {this.state.colorPalette.length} unique colors in your CSS input.</div>;
        }

        return (
            <div>
                <textarea className="closest-color-textarea closest-color-css-input" ref="cssInput"
                          onKeyUp={this.handleCssInput} onPaste={this.handleCssInput}>
                   Paste some CSS lines (or even your entire file) here so we can analyze your existing colors.
                </textarea>
                {referenceColorInputField}
                {moreThanOneReferenceColorNote}
                {colorAnalysisText}
                <div className="closest-color-palette">
                    {colorPaletteItems}
                </div>
            </div>
        );
    }
}