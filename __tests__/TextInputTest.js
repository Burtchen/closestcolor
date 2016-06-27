jest.unmock('../js/TextInput');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {TextInput} from '../js/TextInput';

describe('TextInput', () => {

    it('does not show the text input by default', () => {

        const textInput = TestUtils.renderIntoDocument(
            <TextInput />
        );

        const textInputDomNode = ReactDOM.findDOMNode(textInput);
        expect(textInputDomNode.textContent).toEqual('You can also just type or paste some CSS.');
        expect(textInputDomNode.querySelector('span').classList).toContain('closest-color-css-lead-text');
    });

    it('shows the text input field after clicking', () => {

        const textInput = TestUtils.renderIntoDocument(
            <TextInput />
        );

        const textInputDomNode = ReactDOM.findDOMNode(textInput);

        TestUtils.Simulate.click(textInputDomNode.querySelector('span'));

        const cssInput = textInput.refs.cssInput;

        expect(cssInput.tagName).toEqual('TEXTAREA');
        expect(cssInput.classList).toContain('closest-color-textarea');


    });

    it('calls the handleCssInput method after entering text', () => {

        const handleCssInput = jest.fn();

        const textInput = TestUtils.renderIntoDocument(
            <TextInput handleCssInput={handleCssInput} />
        );

        const textInputDomNode = ReactDOM.findDOMNode(textInput);

        TestUtils.Simulate.click(textInputDomNode.querySelector('span'));

        const cssInput = textInput.refs.cssInput;

        TestUtils.Simulate.keyUp(cssInput, {keyCode : 47});

        expect(handleCssInput).toBeCalled();

    });

    it('calls the handleCssInput method after pasting', () => {

        const handleCssInput = jest.fn();

        const textInput = TestUtils.renderIntoDocument(
            <TextInput handleCssInput={handleCssInput} />
        );

        const textInputDomNode = ReactDOM.findDOMNode(textInput);

        TestUtils.Simulate.click(textInputDomNode.querySelector('span'));

        const cssInput = textInput.refs.cssInput;

        TestUtils.Simulate.paste(cssInput, {data : "bazinga"});

        expect(handleCssInput).toBeCalled();

    });

    it('calls the handleCssInput with the textarea value', () => {

        const handleCssInput = jest.fn();

        const textInput = TestUtils.renderIntoDocument(
            <TextInput handleCssInput={handleCssInput} />
        );

        const textInputDomNode = ReactDOM.findDOMNode(textInput);

        TestUtils.Simulate.click(textInputDomNode.querySelector('span'));

        const cssInput = textInput.refs.cssInput;
        const cssText = "body: black;";

        cssInput.value = cssText;

        TestUtils.Simulate.keyUp(cssInput, {keyCode : 47});

        expect(handleCssInput).toBeCalledWith(cssText);

    });

});