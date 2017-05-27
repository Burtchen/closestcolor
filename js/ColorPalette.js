import {ColorPaletteItem} from './ColorPaletteItem'
import computeColorDifference from './ColorDifference'

const React = require('react');
const ReactDOM = require('react-dom');

const DeltaE = require('delta-e');

const groupBy = require('lodash/groupBy');
const map = require('lodash/map');
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

    getThresholdText(currentColorDifference) {
        if (currentColorDifference < 2.3) {
            return "Imperceptibly close"
        }
        if (currentColorDifference < 5) {
            return "Really close, only distinguishable next to each other"
        }
        if (currentColorDifference < 10) {
            return "Possibly distinguishable in proximity, but still close"
        }
        return "Very distinct colors"
    }

    render() {
        let colorPaletteItems = null;
        if (this.props.referenceColor) {
            let referenceColorItem;
            colorPaletteItems = this.props.colorPalette
                .filter(colorPaletteItem => {
                    return colorPaletteItem.cssName !== this.props.referenceColor.cssName;
                })
                .map(colorPaletteItem => {
                const colorDifference = Math.round(
                    DeltaE.getDeltaE00(colorPaletteItem, this.props.referenceColor),
                    1);
                const thresholdText = this.getThresholdText(colorDifference);
                return {
                    ...colorPaletteItem,
                    colorDifference,
                    thresholdText,
                };
            });

            colorPaletteItems = sortBy(colorPaletteItems, 'colorDifference');


            if (this.props.colorGrouping) {
                const groupedColorPaletteItems = groupBy(colorPaletteItems, 'thresholdText');
                colorPaletteItems = map(groupedColorPaletteItems, (colorPaletteGroup, groupTitle) => {
                    return (
                        <div className="closest-color-palette-group">
                            <h2 className="closest-color-palette-group-title">{groupTitle}</h2>
                            {
                                colorPaletteGroup.map(colorPaletteItem => (
                                    <ColorPaletteItem
                                        {...colorPaletteItem}
                                        colorDisplayValue={this.props.colorDisplayValue}
                                        setPaletteAsReferenceColor={this.props.setPaletteAsReferenceColor}
                                    />
                                ))
                            }
                        </div>
                    );
                });
                referenceColorItem = (
                    <div className="closest-color-palette-group">
                        <h2 className="closest-color-palette-group-title">Your reference color</h2>
                            <ColorPaletteItem
                            {...this.props.referenceColor}
                            referenceColor
                            colorDisplayValue={this.props.colorDisplayValue}
                        />
                    </div>
                    );
            } else {
                colorPaletteItems = colorPaletteItems.map(colorPaletteItem => (
                    <ColorPaletteItem
                        {...colorPaletteItem}
                        colorDisplayValue={this.props.colorDisplayValue}
                        setPaletteAsReferenceColor={this.props.setPaletteAsReferenceColor}
                    />
                ))
                referenceColorItem = (
                    <ColorPaletteItem
                        {...this.props.referenceColor}
                        referenceColor
                        colorDisplayValue={this.props.colorDisplayValue}
                    />
                );
            }
            colorPaletteItems.unshift(referenceColorItem);
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