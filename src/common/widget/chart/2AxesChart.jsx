/**
 * Gráfico genérico de dois eixos.
 * @props {
 *  series: [{ name: '', key: 'Unique Key', color: '#000', type: 'area' || 'line' || null }, ...]
 *  chartData: [{ argument: 'X axis', ...series.key:values }, ...]
 * }
 */

import * as React from 'react'
import _ from 'lodash'
import Paper from '@material-ui/core/Paper'
import {
    Chart,
    LineSeries,
    AreaSeries,
    ScatterSeries,
    Tooltip,
    ValueAxis,
    ArgumentAxis,
    Legend,
    Title
} from '@devexpress/dx-react-chart-material-ui'
import { EventTracker, HoverState } from '@devexpress/dx-react-chart'
import { symbol, symbolCircle } from 'd3-shape'
import { withStyles } from '@material-ui/core/styles'

const Point = (type, styles) => (props) => {
    const { x, y, color } = props
    return (
        <path
            fill={color}
            transform={`translate(${x} ${y})`}
            d={symbol().size([10 ** 2]).type(type)()}
            style={styles}
        />
    )
}

const CirclePoint = Point(symbolCircle, {
    stroke: 'white',
    strokeWidth: '1px',
})

const LineWithCirclePoint = props => (
    <React.Fragment>
        <LineSeries.Path {...props} />
        <ScatterSeries.Path {...props} pointComponent={CirclePoint} />
    </React.Fragment>
)

const AreaWithCirclePoint = props => (
    <React.Fragment>
        <AreaSeries.Path {...props} />
        <ScatterSeries.Path {...props} pointComponent={CirclePoint} />
    </React.Fragment>
)

const TooltipContent = props => {
    const { series, targetItem, chartData } = props
    return (
        <table>
            <tbody>
                {
                    series.map(serie => (
                        <tr key={serie.key}>
                            <td>
                                <svg width="10" height="10">
                                    <circle cx="5" cy="5" r="5" fill={serie.color} />
                                </svg>
                            </td>
                            <td>
                                <Tooltip.Content text={serie.name} />
                            </td>
                            <td align="right">
                                <Tooltip.Content
                                    text={chartData[targetItem.point][serie.key]} />
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </ table>
    )
}

const ValueLabel = (props) => {
    const { text } = props
    return (
        <ValueAxis.Label
            {...props}
            text={`${text.replace(',', '.')}`}
        />
    )
}

const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
    },
})

const legendLabelStyles = theme => ({
    label: {
        paddingTop: theme.spacing.unit,
        whiteSpace: 'nowrap',
    },
})

const legendItemStyles = () => ({
    item: {
        flexDirection: 'column',
    },
})

const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
)

const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
)

const legendItemBase = ({ classes, ...restProps }) => (
    <Legend.Item className={classes.item} {...restProps} />
)

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase)
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase)
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase)

const titleStyles = {
    title: {
        whiteSpace: 'pre',
    }
}
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
    <Title.Text {...props} className={classes.title} />
))

export default class AreaChart extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = { target: null }

        this.changeHover = target => this.setState({ target })
    }

    renderSeries(series) {
        return series.map(serie => {
            switch (serie.type) {
                case 'area':
                    return <AreaSeries
                        seriesComponent={AreaWithCirclePoint}
                        valueField={serie.key}
                        argumentField='argument'
                        {...serie}
                    />

                default:
                    return <LineSeries
                        seriesComponent={LineWithCirclePoint}
                        valueField={serie.key}
                        argumentField='argument'
                        {...serie}
                    />
            }
        })
    }

    render() {
        const { chartData, series } = this.props

        return (
            <Paper>
                <Chart data={chartData} >
                    <ArgumentAxis />
                    <ValueAxis labelComponent={ValueLabel} />

                    {this.renderSeries(series)}

                    <Title
                        text={this.props.title}
                        textComponent={TitleText}
                    />

                    <Legend position="bottom"
                        rootComponent={Root}
                        itemComponent={Item}
                        labelComponent={Label}
                    />

                    <EventTracker />
                    <HoverState
                        hover={this.state.target}
                        onHoverChange={this.changeHover}
                    />

                    <Tooltip
                        targetItem={this.state.target}
                        contentComponent={props => TooltipContent({ chartData, series, ...props })}
                    />
                </Chart>
            </Paper >
        )
    }
}               
