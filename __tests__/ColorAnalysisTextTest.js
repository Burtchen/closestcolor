jest.unmock('../js/ColorAnalysisText');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {ColorAnalysisText} from '../js/ColorAnalysisText';

describe('ColorAnalysisText', () => {

    const textfieldContent = "body: yellow;";

    it('displays the correct amount of entered colors for multiple ones', () => {

        const colorPaletteLength = Math.floor(Math.random() * 5) + 2;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} />
        );
        const resultText = "We found " + colorPaletteLength + " unique colors in the CSS input.";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('displays the correct amount of entered colors for a single one', () => {
        const colorPaletteLength = 1;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} />
        );
        const resultText = "We found " + colorPaletteLength + " unique color in the CSS input.";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows that sorting is done as given without a reference color', () => {
        const colorPaletteLength = 1;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} />
        );
        const resultText = "in their original order";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows that sorting is done with proximity to a given reference color', () => {
        const colorPaletteLength = 1;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} hasReferenceColor={true} />
        );
        const resultText = "by proximity to your reference color";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows the filename if just one file is imported and nothing else', () => {
        const colorPaletteLength = 1;
        const fileInformation = "colors.scss";
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} fileInformation={fileInformation} />
        );
        const resultText = "in " +  fileInformation;
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows the number of files if several files are imported and nothing else', () => {
        const colorPaletteLength = 1;
        const fileInformation = 4;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} fileInformation={fileInformation} />
        );
        const resultText = "in " +  fileInformation + " CSS files";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows CSS input as an input source if that is the only source', () => {
        const colorPaletteLength = 1;
        const fileInformation = 4;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} />
        );
        const resultText = "in the CSS input";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows CSS input as an input source if textfield content and one file are imported', () => {
        const colorPaletteLength = 1;
        const fileInformation = "colors.scss";
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} fileInformation={fileInformation} />
        );
        const resultText = "in the CSS input";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });

    it('shows CSS input as an input source if textfield content and multiple files are imported', () => {
        const colorPaletteLength = 1;
        const fileInformation = 4;
        const colorAnalysisText = TestUtils.renderIntoDocument(
            <ColorAnalysisText colors={colorPaletteLength} textfieldContent={textfieldContent} fileInformation={fileInformation} />
        );
        const resultText = "in the CSS input";
        const info = ReactDOM.findDOMNode(colorAnalysisText);

        expect(info.textContent).toContain(resultText);
    });
});