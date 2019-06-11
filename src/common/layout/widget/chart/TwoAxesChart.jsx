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

import If from '../../../operator/If'

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

        this.state = {
            title: props.title,
            target: null,
            chart: props.chart,
            series: (
                !props.slider ?
                    props.series :
                    props.series.map((serie, index) => (
                        { ...serie, type: 'line' }
                    ))
            )
        }

        this.changeHover = target => this.setState({ target })
        if (props.slider) this.doSlide()
    }

    componentWillReceiveProps(newProps) {

        let state = {}

        if (newProps.title !== this.props.title) {
            state.title = newProps.title
        }

        if (newProps.chart !== this.props.chart) {
            state.chart = newProps.chart
        }

        if (newProps.series !== this.props.series) {
            state.series = (
                !newProps.slider ?
                    newProps.series :
                    newProps.series.map((serie, index) => (
                        { ...serie, type: 'line' }
                    ))
            )
        }

        if (Object.keys(state).length > 0) {
            this.setState(state)

            // Se o props.chart mudar, reinicia o slide
            if (newProps.slider && state.chart) {
                this.doSlide()
            }
        }
    }

    doSlide() {
        let { title, series, chart } = this.props
        const { time, showFullChart, seriesOnLastSlide } = this.props.slider
        let i = -chart.data.length

        clearInterval(this.slideInterval)

        // Definindo intervalo do slider
        this.slideInterval = setInterval(() => {

            const dataLength = chart.data.length
            // Remover bug de assincronia, onde a state.chart muda, mas não atualiza 'chart'
            if (chart.data !== this.props.chart.data) chart = this.props.chart

            // Enquanto 'i < -1', puxa o próximo período do array e incrementa 'i'
            if (i < 0) {
                if (i === -dataLength) this.setState({ series: [] })
                let period = chart.data[dataLength - 1 + (++i)]
                this.setState({
                    title: title + '  ' + period[this.props.argumentField], series, chart: {
                        ...chart, data: [period]
                    }
                })

                // Após exibir iterar em todos os períodos, exibe uma timeline com todos,
                // em gráfico de linhas, caso 'showFullChart == true'
            } else if (showFullChart) {

                if (i === 0 && dataLength > 0) {
                    this.setState({ series: [] })

                    this.setState({
                        title: title + '  '
                            + chart.data[0][this.props.argumentField] + '-'
                            + chart.data[dataLength - 1][this.props.argumentField],
                        chart,
                        series: series.filter((serie, index) => (
                            !seriesOnLastSlide || seriesOnLastSlide.indexOf(index) > -1
                        )).map((serie, index) => ({ ...serie, type: 'line' }))
                    })
                }

                if (++i > 1) i = -dataLength
            } else {
                // Se não for para exibir o FullChart, apenas reinicia a iteração
                i = -dataLength
            }

        }, time)
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

    renderLegend(legend) {
        // eslint-disable-next-line default-case
        switch (legend.position || 'bottom') {
            case 'top':
            case 'bottom':
                legend.rootComponent = Root
                legend.itemComponent = Item
                legend.labelComponent = Label
        }

        return <Legend position="bottom"
            {...legend}
        />
    }

    render() {
        const { legend, slider } = this.props
        const { title, chart, series } = this.state

        return (
            <Paper>
                <Chart {...chart} >

                    <ArgumentScale />
                    <ValueScale modifyDomain={modifyDomain(this.props)} />

                    {slider ? '' : <ArgumentAxis />}

                    {
                        this.props.showValueAxi === false ? '' : <ValueAxis labelComponent={ValueLabel} />
                    }

                    {this.renderSeries(series)}

                    <Title
                        text={title}
                        textComponent={TitleText}
                    />

                    {this.props.stack ? <Stack /> : ''}

                    {this.renderLegend(legend || {})}

                    <EventTracker />
                    <HoverState
                        hover={this.state.target}
                        onHoverChange={this.changeHover}
                    />

                    {
                        slider ? '' : (<Tooltip
                            targetItem={this.state.target}
                            contentComponent={props => TooltipContent({
                                chartData: chart.data,
                                series,
                                ...props,
                                style: { display: 'block' }
                            })}
                        />
                        )
                    }
                    <Animation />
                </Chart>
            </Paper >
        )
    }

    point = (type, styles) => (props) => {
        const { x, y, color, value } = props

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

    linePointSeries = props => (
        <React.Fragment>
            {svgDefs}
            <LineSeries.Path {...props} />
            <ScatterSeries.Path {...props} pointComponent={this.circlePoint} >
            </ScatterSeries.Path>
        </React.Fragment>
    )

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