var React = require('react');
var ReactDOM = require('react-dom');
import getColorValues from './ColorDetection'

export class ReferenceColorInput extends React.Component {

    constructor(props) {
        super(props);
        this.handleReferenceColorInput = this.handleReferenceColorInput.bind(this);
        this.state = {moreThanOneReferenceColor: false};
    }

    handleReferenceColorInput() {
        const extractedColors = getColorValues(this.refs.referenceColorInput.value);
        if (extractedColors && extractedColors.length) {
            this.props.setReferenceColor(extractedColors[0]);
            this.setState({moreThanOneReferenceColor: extractedColors.length > 1});

        }
    }

    render() {

        const moreThanOneReferenceColorNote = this.state.moreThanOneReferenceColor ?
            <div>Your input contained more than one color, using the first detected one.</div> : null;

        return (
            <div>
                <div>
                    <input type="text" ref="referenceColorInput" placeholder="Insert color to compare"/>
                    <button onClick={this.handleReferenceColorInput}>Compare colors</button>
                </div>
                {moreThanOneReferenceColorNote}
            </div>
        );
    }
}