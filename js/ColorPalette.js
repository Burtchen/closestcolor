import {ColorPaletteItem} from './ColorPaletteItem'
import computeColorDifference from './ColorDifference'

var React = require('react');
var ReactDOM = require('react-dom');

const sortBy = require('lodash/sortBy');
const times = require('lodash/times');

const NONE = "none";
const CONSTRAINED_SINGLE_LINE = "constrained-single-line";
const MULTIPLE_LINES = "multiple-lines";

export class ColorPalette extends React.Component {

    constructor(props) {
        super(props);
        //this.itemLayout = this.itemLayout.bind(this);
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
        if (this.props.colorPalette.length !== prevProps.colorPalette.length) {
            this.setState({itemLayoutModifier: this.itemLayoutModifier});
        }
    }

    render() {
        let colorPaletteItems = null;
        if (this.props.referenceColor) {
            colorPaletteItems = this.props.colorPalette.map((colorPaletteItem) => {
                const colorDifference = computeColorDifference(colorPaletteItem, this.props.referenceColor);
                return <ColorPaletteItem {...colorPaletteItem} colorDifference={colorDifference} colorDisplayValue={this.props.colorDisplayValue}/>
            });
            colorPaletteItems = sortBy(colorPaletteItems, (colorPaletteItem) => {
                return colorPaletteItem.props.colorDifference;
            });
            const referenceColorItem = <ColorPaletteItem {...this.props.referenceColor} referenceColor={true} colorDisplayValue={this.props.colorDisplayValue}/>;
            colorPaletteItems.unshift(referenceColorItem);
        } else {
            let sortedColorPalette = sortBy(this.props.colorPalette, (detectedColor) => {
                return detectedColor.lightness
            });
            colorPaletteItems = sortedColorPalette.map((colorPaletteItem) => {
                return <ColorPaletteItem {...colorPaletteItem} colorDisplayValue={this.props.colorDisplayValue}/>
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