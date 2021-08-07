jest.unmock('../js/ColorPaletteItem');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {ColorPaletteItem} from '../../js/ColorPaletteItem';

describe('ColorPaletteItem', () => {

    const colorObject = {
        red: 45,
        green: 225,
        blue: 0
    };

    it('displays the color with rgb()-text when colorDisplayValue is rgb', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="rgb" {...colorObject} />
        );

        const info = colorPaletteItem.refs.colorInfo;
        expect(info.textContent).toEqual('rgb(45, 225, 0)');
    });

    it('displays the color with hsl()-text when colorDisplayValue is hsl', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hsl" {...colorObject} />
        );

        const info = colorPaletteItem.refs.colorInfo;
        expect(info.textContent).toEqual('hsl(108, 100, 44)');
    });

    it('displays the color as hexadecimal output when colorDisplayValue is hex', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hex" {...colorObject} />
        );

        const info = colorPaletteItem.refs.colorInfo;
        expect(info.textContent).toEqual('#2DE100');
    });

        it('displays the color as original output when colorDisplayValue is original', () => {

        const cssName = "#23827f";
        const variableName = "$cssColor";
        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="original" {...colorObject} cssName={cssName} variableName={variableName} />
        );

        const info = colorPaletteItem.refs.colorInfo;
        expect(info.textContent).toEqual(cssName + variableName);
    });

        it('displays the css variable name when given', () => {

        const cssName = "#23827f";
        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="original" {...colorObject} cssName={cssName} />
        );

        const info = colorPaletteItem.refs.colorInfo;
        expect(info.textContent).toEqual(cssName);
    });

    it('displays dark text when the lightness exceeds 75', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hex" {...colorObject} L={76} />
        );
        const itemDomNode = ReactDOM.findDOMNode(colorPaletteItem);
        expect(itemDomNode.classList).toContain('closest-color-palette-item-dark-text');
    });

    it('does not display dark text when the lightness is below 75', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hex" {...colorObject} L={70} />
        );
        const itemDomNode = ReactDOM.findDOMNode(colorPaletteItem);
        expect(itemDomNode.classList).not.toContain('closest-color-palette-item-dark-text');
    });

    it('shows the colorDifference in the item', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hex" {...colorObject} L={70} colorDifference={2} />
        );
        const itemDomNode = ReactDOM.findDOMNode(colorPaletteItem);
        expect(itemDomNode.textContent).toEqual('#2DE100ΔE: 2');
    });

    it('shows a title text for every color difference value', () => {

        const colorPaletteItem = TestUtils.renderIntoDocument(
            <ColorPaletteItem colorDisplayValue="hex" {...colorObject} L={70} colorDifference={2} />
        );
        const itemDomNode = ReactDOM.findDOMNode(colorPaletteItem);
        const expectedTitleText = "With a ΔE of 2, there is an imperceptible difference, this color can be safely replaced.";

        expect(itemDomNode.getAttribute('title')).toEqual(expectedTitleText);
    });
});