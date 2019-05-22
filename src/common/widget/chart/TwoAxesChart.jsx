/**
 * Gráfico genérico de dois eixos.
 * @props {
 *  series: [{ name: '', key: 'Unique Key', color: '#000', type: 'area' || 'line' || 'bar' || null }, ...]
 *  chartData: [{ argument: 'X axis', ...series.key:values }, ...]
 * }
 */

import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import {
    Chart, LineSeries, BarSeries, AreaSeries, ScatterSeries,
    Tooltip, ValueAxis, ArgumentAxis, Legend, Title
} from '@devexpress/dx-react-chart-material-ui'
import {
    EventTracker, HoverState, ArgumentScale,
    ValueScale, Animation, Stack
} from '@devexpress/dx-react-chart'
import { symbol, symbolCircle } from 'd3-shape'
import { withStyles } from '@material-ui/core/styles'

import If from '../../operator/If'

const svgDefs = (
    <defs>
        <filter x="0" y="0" width="1" height="1" id="solid-bg">
            <feFlood floodColor="#ffffffc0" />
            <feComposite in="SourceGraphic" />
        </filter>
    </defs>
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
            text={`${('' + text).replace(',', '.')}`}
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
    <Legend.Root {...restProps} className={classes.root} style={{ paddingBottom: 0 }} />
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
        marginBottom: '10px'
    }
}
const TitleText = withStyles(titleStyles)(({ classes, ...props }) =>
    <Title.Text {...props} className={classes.title} />
)

// Aumentando scala de altura para melhor visualização do gráfico
const modifyDomain = props => domain => {
    // Reduz em 50% a menor escala do chart
    domain[0] -= 0.5 * domain[0]

    // Se deve exibir label horizontal, aumenta a maior escala em 10%
    if (props.serieLabel && props.serieLabel === 'horizontal') {
        domain[1] *= 1.10
    } else {
        // Senão, aumenta apenas 3%
        domain[1] *= 1.03
    }

    return domain
}

export default class TwoAxesChart extends React.PureComponent {
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
                        seriesComponent={this.areaPointSeries}
                        valueField={serie.key}
                        argumentField={this.props.argumentField}
                        {...serie}
                    />

                case 'bar':
                    return <BarSeries
                        pointComponent={this.barPoint}
                        valueField={serie.key}
                        argumentField={this.props.argumentField}
                        {...serie}
                    />

                default:
                    return <LineSeries
                        seriesComponent={this.linePointSeries}
                        valueField={serie.key}
                        argumentField={this.props.argumentField}
                        {...serie}
                    />
            }
        })
    }

    render() {
        const { chart, series } = this.props

        return (
            <Paper>
                <Chart {...chart} >

                    <ArgumentScale />
                    <ValueScale modifyDomain={modifyDomain(this.props)} />
                    <ArgumentAxis />
                    {
                        this.props.showValueAxi === false ? '' : <ValueAxis labelComponent={ValueLabel} />
                    }

                    {this.renderSeries(series)}

                    <Title
                        text={this.props.title}
                        textComponent={TitleText}
                    />

                    {this.props.stack ? <Stack /> : ''}

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
                        contentComponent={props => TooltipContent({
                            chartData: chart.data,
                            series,
                            ...props,
                            style: { display: 'block' }
                        })}
                    />
                    <Animation />
                </Chart>
            </Paper >
        )
    }

    point = (type, styles) => (props) => {
        const { x, y, color, value } = props
        console.log(props)
        return (
            <React.Fragment>
                <path
                    fill={color}
                    transform={`translate(${x} ${y})`}
                    d={symbol().size([6 ** 2]).type(type)()}
                    style={styles}
                />
                <If test={this.props.serieLabel && this.props.serieLabel === 'horizontal'}>
                    <Chart.Label filter="url(#solid-bg)"
                        style={{ fill: 'rgba(0, 0, 0, 0.73)' }}
                        x={x}
                        y={y}
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        {value}
                    </Chart.Label>
                </If>
            </React.Fragment>
        )
    }

    circlePoint = this.point(symbolCircle, {
        stroke: 'white',
        strokeWidth: '1px',
    })

    areaPointSeries = props => (
        <React.Fragment>
            {svgDefs}
            <AreaSeries.Path {...props} />
            <ScatterSeries.Path {...props} pointComponent={this.circlePoint} />
        </React.Fragment>
    )

    linePointSeries = props => {
        console.log(props)
        return (
            <React.Fragment>
                {svgDefs}
                <LineSeries.Path {...props} />
                <ScatterSeries.Path {...props} pointComponent={this.circlePoint} >
                </ScatterSeries.Path>
            </React.Fragment>
        )
    }

    barPoint = props => (
        <React.Fragment>
            <BarSeries.Point {...props} />

            <If test={this.props.serieLabel && this.props.serieLabel === 'horizontal'}>
                <Chart.Label
                    style={{ fill: 'rgba(0, 0, 0, 0.54)' }}
                    x={props.x}
                    y={props.y - 6}
                    dominantBaseline="middle"
                    textAnchor="middle"
                >
                    {props.value}
                </Chart.Label>
            </If>
        </React.Fragment>
    )
}