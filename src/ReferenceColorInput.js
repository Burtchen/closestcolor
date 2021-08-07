import React from 'react';
import getColorValues from './ColorDetection'

export class ReferenceColorInput extends React.Component {

    constructor(props) {
        super(props);
        this.handleReferenceColorInput = this.handleReferenceColorInput.bind(this);
        this.state = {
            moreThanOneReferenceColor: false,
            useExternalReference: true,
        };
    }

    getValueIfNeeded() {
        return this.state.useExternalReference && this.props.referenceColor !== null ? this.props.referenceColor.cssName : undefined;
    }

    clearExternalReference() {
        this.setState({useExternalReference: false});
        this.props.setReferenceColor(null);
    }

    handleReferenceColorInput() {
        const extractedColors = getColorValues(this.refs.referenceColorInput.value);
        if (extractedColors && extractedColors.length) {
            this.props.setReferenceColor(extractedColors[0]);
            this.setState({moreThanOneReferenceColor: extractedColors.length > 1});
        } else {
            this.props.setReferenceColor(null);
            this.setState({moreThanOneReferenceColor: false});
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.referenceColor !== this.props.referenceColor && !this.state.useExternalReference) {
            this.setState({useExternalReference: true});
        }
    }

    render() {
        const moreThanOneReferenceColorNote = this.state.moreThanOneReferenceColor ?
            <div>Your input contained more than one color, using the first detected one.</div> : null;
        const className= moreThanOneReferenceColorNote ? "sub-section" : null;

        return (
            <div>
                <div className={className}>
                    <input type="text" ref="referenceColorInput" placeholder="Your color" value={this.getValueIfNeeded()} onInput={() => this.clearExternalReference()} />
                    <button onClick={this.handleReferenceColorInput} disabled={!!this.props.referenceColor}>Find closest color</button>
                </div>
                {moreThanOneReferenceColorNote}
            </div>
        );
    }
}