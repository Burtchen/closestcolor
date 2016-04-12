import {ColorPaletteItem} from './ColorPaletteItem'
import {FileUploader} from './FileUploader'
import {TextInput} from './TextInput'
import {ReferenceColorInput} from './ReferenceColorInput'
import getColorValues from './ColorDetection'
import computeColorDifference from './ColorDifference'

const React = require('react');
const ReactDOM = require('react-dom');

const uniqBy = require('lodash/uniqBy');

export class Cssinput extends React.Component {
    constructor(props) {
        super(props);
        this.handleCssInput = this.handleCssInput.bind(this);
        this.setReferenceColor = this.setReferenceColor.bind(this);
        this.storeCssFile = this.storeCssFile.bind(this);
        this.processCss = this.processCss.bind(this);
        this.state = {
            colorPalette: [],
            referenceColor: null,
            textfieldContent: '',
            cssFileContent: ''
        }
    }

    setReferenceColor(color) {
        this.setState({referenceColor: color});
    }

    handleCssInput(cssInputContent) {
        this.setState({textfieldContent: cssInputContent}, this.processCss);
    }

    storeCssFile(cssFileContent) {
        this.setState({cssFileContent: cssFileContent}, this.processCss);
    }

    processCss() {
        const combinedInput = this.state.textfieldContent + this.state.cssFileContent;
        let detectedColors = getColorValues(combinedInput) || [];
        detectedColors = uniqBy(detectedColors, (detectedColor) => {
            // cf. http://stackoverflow.com/a/26306963
            return [detectedColor.red, detectedColor.green, detectedColor.blue].join(" ");
        });

        this.setState({colorPalette: detectedColors});
    }

    render() {
        let colorPaletteItems = null;
        let colorAnalysisText = null;
        let referenceColorInput = null;

        if (this.state.colorPalette.length > 0) {
            colorPaletteItems = this.state.colorPalette.map((colorPaletteItem) => {
                const colorDifference = this.state.referenceColor ? computeColorDifference(colorPaletteItem, this.state.referenceColor) : null;
                return <ColorPaletteItem {...colorPaletteItem} colorDifference={colorDifference}/>
            });
            colorAnalysisText = <div>We found {this.state.colorPalette.length} unique colors in your CSS input.</div>;
            referenceColorInput = (<section className="center-content">
                <ReferenceColorInput setReferenceColor={this.setReferenceColor}/>
            </section>);
        }

        return (
            <div>
                <section className="center-content">
                    <span>You have an existing color palette, but the latest design brief has a slightly mismatched color? Or you want to clean up your palette? Easily analyse your analyse and find the closest matches!</span>
                </section>
                <section className="center-content">
                    <FileUploader storeCssFile={this.storeCssFile}/>
                    <TextInput handleCssInput={this.handleCssInput}/>
                    {colorAnalysisText}
                </section>
                    {referenceColorInput}
                <div className="row closest-color-palette col-xs-12 col-sm-8 col-md-6 col-lg-4">
                    {colorPaletteItems}
                </div>
            </div>
        );
    }
}