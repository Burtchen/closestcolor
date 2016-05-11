var React = require('react');
var ReactDOM = require('react-dom');

export class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.reset = this.reset.bind(this);
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

    reset() {
        // http://stackoverflow.com/a/829740
        this.refs.form.reset();
        this.props.storeCssFile('', null);
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
        if (!this.state.show) {
            return null;
        }

        const byLine = this.props.canClear ?
            <span className="closest-color-file-uploader-byline closest-color-file-uploader-reset" onClick={this.reset}>Clear imported styles</span> :
            <span className="closest-color-file-uploader-byline">Your data is not uploaded to a server or stored in any form.</span>;

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