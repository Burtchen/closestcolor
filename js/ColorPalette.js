import {ColorPaletteItem} from './ColorPaletteItem'
import computeColorDifference from './ColorDifference'

var React = require('react');
var ReactDOM = require('react-dom');

const sortBy = require('lodash/sortBy');
const times = require('lodash/times');

export class ColorPalette extends React.Component {

    constructor(props) {
        super(props);
        this.showFillerItems = this.showFillerItems.bind(this);
        this.remeasure = this.remeasure.bind(this);
        this.state = {
            showFillerItems: false
        }
    }

    remeasure() {
        this.setState({showFillerItems: this.showFillerItems()});
    };

    showFillerItems() {
        if (this.props.colorPalette.length < 6) {
            return false;
        }

        if (window.matchMedia("(max-width: 768px)").matches) {
            return false;
        }

        const colorPaletteItems = ReactDOM.findDOMNode(this).querySelectorAll('.closest-color-palette-item');
        const firstColorPaletteItem = colorPaletteItems[0];
        const lastColorPaletteItem = colorPaletteItems[colorPaletteItems.length - 1];
        const moreThanOneLine = firstColorPaletteItem.getBoundingClientRect().top !== lastColorPaletteItem.getBoundingClientRect().top;
        return moreThanOneLine;
    }

    componentDidMount() {
        this.setState({showFillerItems: this.showFillerItems()});
        window.addEventListener('resize', this.remeasure);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.remeasure);
    }

    componentDidUpdate(prevProps) {
        if (this.props.colorPalette.length !== prevProps.colorPalette.length) {
            this.setState({showFillerItems: this.showFillerItems()});
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

        let fillerItems = [];
        if (this.state.showFillerItems) {
            // see http://jsbin.com/qaxatujaho/1/edit?html,css,output and http://stackoverflow.com/q/22085646
            const fillerItemCount = Math.min(colorPaletteItems.length, 10);
            times(fillerItemCount, () => {fillerItems.push(<div className="closest-color-palette-filler-item"/>)});
        }

        return (
            <div className="closest-color-palette">
                {colorPaletteItems}
                {fillerItems}
            </div>
        );
    }
}