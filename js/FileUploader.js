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
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.setState({
                'show': true
            });
        }
    }

    handleFileUpload(e) {
        let cssFileContent = "";
        if (e && e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const uploadedFile = e.target.files[i];
                const reader = new FileReader();
                const isLastFile = i + 1 === e.target.files.length;
                reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) {
                        cssFileContent += loadEvent.target.result;
                        if (isLastFile) {
                            this.props.processCss(cssFileContent);
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
            <div className="closest-color-file-uploader">
                <input type="file" id="files" name="uploadedFiles" ref="fileUploader" onChange={this.handleFileUpload} multiple/>
                {this.props.colorDifference}
            </div>
        );
    }
}