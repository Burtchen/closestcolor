import React from 'react';

export class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.reset = this.reset.bind(this);
    }

    reset() {
        // http://stackoverflow.com/a/829740
        this.refs.form.reset();
        this.props.storeCssFile('', null);
        try {
            localStorage.removeItem('colorPalette');
        } catch (error) {
            return;
        }
    }

    handleFileUpload(e) {
        let cssFileContent = "";
        if (e && e.target.files) {
            const fileInformation = e.target.files.length > 1 ? e.target.files.length : e.target.files[0].name ;
            for (let i = 0; i < e.target.files.length; i++) {
                const uploadedFile = e.target.files[i];
                const reader = new FileReader();
                const isLastFile = i + 1 === e.target.files.length;
                reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) {
                        cssFileContent += loadEvent.target.result;
                        if (isLastFile) {
                            this.props.storeCssFile(cssFileContent, fileInformation);
                        }
                    }
                };
                reader.readAsText(uploadedFile);
            }
        }
    }

    render() {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return null;
        }

        const byLine = this.props.canClear ?
            <span ref="byline" className="closest-color-file-uploader-byline closest-color-file-uploader-reset" onClick={this.reset}>Clear imported/cached styles</span> :
            <span ref="byline" className="closest-color-file-uploader-byline">Your data is not transferred or uploaded anywhere.</span>;

        return (
            <div className="sub-section">
                <form ref="form">
                    <input type="file" className="closest-color-file-uploader" id="closest-color-file-uploader" name="closest-color-file-uploader" onChange={this.handleFileUpload} multiple/>
                    <label className="button closest-color-file-uploader-button" htmlFor="closest-color-file-uploader"><i className="fa fa-upload fa-fw"></i>Import your styles</label>
                </form>
                <div>{byLine}</div>
            </div>
        );
    }
}