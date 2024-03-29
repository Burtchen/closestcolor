import './normalize.css';
import './stylesheet.css';

import {ColorPalette} from './ColorPalette'
import {ColorAnalysisText} from './ColorAnalysisText'
import {FileUploader} from './FileUploader'
import {TextInput} from './TextInput'
import {ReferenceColorInput} from './ReferenceColorInput'
import getColorValues from './ColorDetection'
import React from "react";
import uniqBy from "lodash/uniqBy";

export class ClosestColorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleCssInput = this.handleCssInput.bind(this);
    this.setReferenceColor = this.setReferenceColor.bind(this);
    this.setPaletteAsReferenceColor = this.setPaletteAsReferenceColor.bind(this);
    this.handleColorDisplayChange = this.handleColorDisplayChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.storeCssFile = this.storeCssFile.bind(this);
    this.processCss = this.processCss.bind(this);

    let cachedColorPalette = [];

    try {
      cachedColorPalette = JSON.parse(localStorage.getItem('colorPalette')) || [];
    } catch (error) {
      cachedColorPalette = [];
    }

    this.state = {
      colorPalette: cachedColorPalette || [],
      colorGrouping: false,
      colorDisplayValue: "original",
      referenceColor: null,
      fileInformation: null,
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

  handleColorDisplayChange(event) {
    this.setState({colorDisplayValue: event.target.value});
  }

  handleGroupChange(event) {
    this.setState({colorGrouping: event.target.value !== "false"});
  }

  storeCssFile(cssFileContent, fileInformation) {
    this.setState({
      cssFileContent: cssFileContent,
      fileInformation: fileInformation
    }, this.processCss);
  }

  processCss() {
    const combinedInput = this.state.textfieldContent + " " + this.state.cssFileContent;
    let detectedColors = getColorValues(combinedInput) || [];
    detectedColors = uniqBy(detectedColors, (detectedColor) => {
      // cf. http://stackoverflow.com/a/26306963
      return [detectedColor.red, detectedColor.green, detectedColor.blue].join(" ");
    });
    this.setState({colorPalette: detectedColors});
    try {
      localStorage.setItem('colorPalette', JSON.stringify(detectedColors));
    } catch (error) {
      return;
    }
  }

  setPaletteAsReferenceColor(color) {
    this.setReferenceColor(color);
  }

  render() {
    let colorAnalysisText = null;
    let referenceColorInput = null;
    let colorPalette = null;

    if (this.state.colorPalette && this.state.colorPalette.length) {
      colorPalette = <ColorPalette
        colorPalette={this.state.colorPalette}
        referenceColor={this.state.referenceColor}
        colorDisplayValue={this.state.colorDisplayValue}
        setPaletteAsReferenceColor={this.setPaletteAsReferenceColor}
        colorGrouping={this.state.colorGrouping}
      />;
      colorAnalysisText = <ColorAnalysisText
        colors={this.state.colorPalette.length}
        fileInformation={this.state.fileInformation}
        textfieldContent={this.state.textfieldContent}
        hasReferenceColor={this.state.referenceColor}
        handleColorDisplayChange={this.handleColorDisplayChange}
        handleGroupChange={this.handleGroupChange}
      />;
      referenceColorInput = (<section className="center-content">
        <ReferenceColorInput setReferenceColor={this.setReferenceColor} referenceColor={this.state.referenceColor}/>
      </section>);
    }

    let hasCachedPalette;
    try {
      hasCachedPalette = localStorage.getItem('colorPalette')
        && JSON.parse(localStorage.getItem('colorPalette')).length;
    } catch (error) {
      hasCachedPalette = false;
    }
    const fileUploaderCanClear =
      hasCachedPalette || this.state.cssFileContent && this.state.cssFileContent.length;

    return (
      <div>
        <section className="center-content">
          <div className="closest-color-hero-text">
            <span>See your color palette. Find the color closest to the one you might have to add. Then don't add it.</span>
          </div>
        </section>
        <section className="center-content">
          <FileUploader storeCssFile={this.storeCssFile} canClear={fileUploaderCanClear}/>
          <TextInput handleCssInput={this.handleCssInput}/>
        </section>
        {referenceColorInput}
        {colorAnalysisText}
        {colorPalette}
      </div>
    );
  }
}

export default ClosestColorContainer;
