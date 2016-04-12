var React = require('react');
var ReactDOM = require('react-dom');

export class TextInput extends React.Component {

    constructor(props) {
        super(props);
        this.showTextarea = this.showTextarea.bind(this);
        this.storeCssInput = this.storeCssInput.bind(this);
        this.state = {showTextarea: false};
    }

    showTextarea() {
        this.setState({showTextarea: true});
    }

    storeCssInput() {
        this.props.handleCssInput(this.refs.cssInput.value);
    }

    render() {
        const content = !this.state.showTextarea ?
            <span className="closest-color-css-lead-text" onClick={this.showTextarea}>Or type some CSS.</span> :
            (<textarea className="closest-color-textarea" ref="cssInput"
                      onKeyUp={this.storeCssInput} onPaste={this.storeCssInput}>
                   Paste some CSS or SCSS here.
                </textarea>);

        return (
            <div>
                {content}
            </div>
        );
    }
}