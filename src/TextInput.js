import React from "react";

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
            <span className="closest-color-css-lead-text" onClick={this.showTextarea}>You can also just type or paste some CSS.</span> :
            (<textarea className="closest-color-textarea" ref="cssInput"
                      onKeyUp={this.storeCssInput} onPaste={this.storeCssInput} placeholder="Type CSS/SCSS, or just color defintions. RGB(A), HSL(A), hex and CSS names are supported.">
                </textarea>);

        return (
            <div>
                {content}
            </div>
        );
    }
}