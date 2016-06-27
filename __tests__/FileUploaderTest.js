jest.unmock('../js/FileUploader');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {FileUploader} from '../js/FileUploader';

describe('FileUploader', () => {

    it('does not show the reset option when canClear prop is not provided and does not add the corresponding class', () => {

        const fileUploader = TestUtils.renderIntoDocument(
            <FileUploader />
        );

        const uploaderDomNode = fileUploader.refs.byline;
        expect(uploaderDomNode.textContent).toEqual('Your data is not uploaded to a server or stored in any form.');
        expect(uploaderDomNode.classList).not.toContain('closest-color-file-uploader-reset');
    });

    it('shows the reset option when canClear prop is provided and adds the correct class', () => {

        const fileUploader = TestUtils.renderIntoDocument(
            <FileUploader canClear={true} />
        );

        const uploaderDomNode = fileUploader.refs.byline;
        expect(uploaderDomNode.textContent).toEqual('Clear imported styles');
        expect(uploaderDomNode.classList).toContain('closest-color-file-uploader-reset');
    });
});