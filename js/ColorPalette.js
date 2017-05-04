import {ColorPaletteItem} from './ColorPaletteItem'
import computeColorDifference from './ColorDifference'

const React = require('react');
const ReactDOM = require('react-dom');

const DeltaE = require('delta-e');

const sortBy = require('lodash/sortBy');
const times = require('lodash/times');

const NONE = "none";
const CONSTRAINED_SINGLE_LINE = "constrained-single-line";
const MULTIPLE_LINES = "multiple-lines";

export class ColorPalette extends React.Component {

    constructor(props) {
        super(props);
        this.remeasure = this.remeasure.bind(this);
        this.state = {
            itemLayoutModifier: NONE
        }
    }

    remeasure() {
        this.setState({itemLayoutModifier: this.itemLayoutModifier});
    };

    get itemLayoutModifier() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            return NONE;
        }

        const colorPaletteItems = ReactDOM.findDOMNode(this).querySelectorAll('.closest-color-palette-item');
        const firstColorPaletteItem = colorPaletteItems[0];
        const lastColorPaletteItem = colorPaletteItems[colorPaletteItems.length - 1];
        const moreThanOneLine = firstColorPaletteItem.getBoundingClientRect().top !== lastColorPaletteItem.getBoundingClientRect().top;

        if (moreThanOneLine) {
            return MULTIPLE_LINES;
        } else if (ReactDOM.findDOMNode(this).getBoundingClientRect().width / colorPaletteItems.length > 250) {
            return CONSTRAINED_SINGLE_LINE;
        }

        return NONE;
    }

    componentDidMount() {
        this.setState({itemLayoutModifier: this.itemLayoutModifier});
        window.addEventListener('resize', this.remeasure);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.remeasure);
    }

    componentDidUpdate(prevProps) {
        if (this.props.colorPalette.length !== prevProps.colorPalette.length || this.props.referenceColor !== prevProps.referenceColor) {
            this.setState({itemLayoutModifier: this.itemLayoutModifier});
        }
    }

    render() {
        let colorPaletteItems = null;
        if (this.props.referenceColor) {
            colorPaletteItems = this.props.colorPalette.map((colorPaletteItem) => {
                const colorDifference = Math.round(
                    DeltaE.getDeltaE00(colorPaletteItem, this.props.referenceColor),
                    1);
                return <ColorPaletteItem {...colorPaletteItem} colorDifference={colorDifference} colorDisplayValue={this.props.colorDisplayValue} setPaletteAsReferenceColor={this.props.setPaletteAsReferenceColor}/>
            });
            colorPaletteItems = sortBy(colorPaletteItems, (colorPaletteItem) => {
                return colorPaletteItem.props.colorDifference;
            });
            const referenceColorItem = <ColorPaletteItem {...this.props.referenceColor} referenceColor={true} colorDisplayValue={this.props.colorDisplayValue} setPaletteAsReferenceColor={this.props.setPaletteAsReferenceColor}/>;
            // if there is an item identical to the reference color
            // but not it (i.e. click on palette), replace with reference - otherwise prepend
            const firstColorProps = colorPaletteItems[0].props;
            const referenceColorProps = referenceColorItem.props;
            if (firstColorProps.L === referenceColorProps.L
                && firstColorProps.A === referenceColorProps.A
                && firstColorProps.B === referenceColorProps.B
            ) {
                colorPaletteItems[0] = referenceColorItem;
            } else {
                colorPaletteItems.unshift(referenceColorItem);
            }
        } else {
            let sortedColorPalette = sortBy(this.props.colorPalette, (detectedColor) => {
                return detectedColor.L
            });
            colorPaletteItems = sortedColorPalette.map((colorPaletteItem) => {
                return <ColorPaletteItem {...colorPaletteItem} colorDisplayValue={this.props.colorDisplayValue} setPaletteAsReferenceColor={this.props.setPaletteAsReferenceColor}/>
            });
        }


        let colorPaletteClass = "closest-color-palette";
        let fillerItems = [];
        if (this.state.itemLayoutModifier === MULTIPLE_LINES) {
            // see http://jsbin.com/qaxatujaho/1/edit?html,css,output and http://stackoverflow.com/q/22085646
            const fillerItemCount = Math.min(colorPaletteItems.length, 10);
            times(fillerItemCount, () => {fillerItems.push(<div className="closest-color-palette-filler-item"/>)});
        } else if (this.state.itemLayoutModifier === CONSTRAINED_SINGLE_LINE) {
            colorPaletteClass += " closest-color-palette-single-line";
        }


        return (
            <div className={colorPaletteClass}>
                {colorPaletteItems}
                {fillerItems}
            </div>
        );
    }
}