var React = require('react');
var ReactDOM = require('react-dom');

export class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        //TODO: Consider https://github.com/Modernizr/Modernizr/blob/master/feature-detects/forms/fileinput.js
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.setState({
                'show': true
            });
        }
    }

    handleFileUpload(e) {
        // TODO: Option to clear file uploads
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
        if (!this.state.show) {
            return null;
        }
        return (
            <div className="sub-section">
                <input type="file" className="closest-color-file-uploader" id="closest-color-file-uploader" name="closest-color-file-uploader" ref="fileUploader" onChange={this.handleFileUpload} multiple/>
                <label className="button closest-color-file-uploader-button" htmlFor="closest-color-file-uploader">Import your styles</label>
                <div><span className="closest-color-file-uploader-byline">Your data is not uploaded to a server or stored in any form.</span></div>
            </div>
        );
    }
}