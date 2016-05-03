import {ColorPaletteItem} from './ColorPaletteItem'
import computeColorDifference from './ColorDifference'

var React = require('react');
var ReactDOM = require('react-dom');

const sortBy = require('lodash/sortBy');
const times = require('lodash/times');

export class ColorPalette extends React.Component {

    render() {
        let colorPaletteItems = null;
        if (this.props.referenceColor) {
            colorPaletteItems = this.props.colorPalette.map((colorPaletteItem) => {
                const colorDifference = computeColorDifference(colorPaletteItem, this.props.referenceColor);
                return <ColorPaletteItem {...colorPaletteItem} colorDifference={colorDifference}/>
            });
            colorPaletteItems = sortBy(colorPaletteItems, (colorPaletteItem) => {
                return colorPaletteItem.props.colorDifference;
            });
            const referenceColorItem = <ColorPaletteItem {...this.props.referenceColor} referenceColor={true}   />;
            colorPaletteItems.unshift(referenceColorItem);
        } else {
            let sortedColorPalette = sortBy(this.props.colorPalette, (detectedColor) => {
                return detectedColor.lightness
            });
            colorPaletteItems = sortedColorPalette.map((colorPaletteItem) => {
                return <ColorPaletteItem {...colorPaletteItem}/>
            });
        }

        const fillerItemCount = Math.min(colorPaletteItems.length, 10);
        let fillerItems = [];
        times(fillerItemCount, () => {fillerItems.push(<div className="closest-color-palette-filler-item"/>)});

        return (
            <div className="closest-color-palette">
                {colorPaletteItems}
                {fillerItems}
            </div>
        );
    }
}