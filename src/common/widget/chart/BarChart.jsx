import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    BarSeries,
    Title,
    Legend,
} from '@devexpress/dx-react-chart-material-ui'
import { withStyles } from '@material-ui/core/styles'
import { Stack, Animation } from '@devexpress/dx-react-chart'

const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
    },
})
const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
)
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase)
const legendLabelStyles = () => ({
    label: {
        whiteSpace: 'nowrap',
    },
})
const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
)
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase)

export default class Demo extends React.PureComponent {

    renderSeries(series) {
        return series.map(serie =>
            <BarSeries
                valueField={serie.key}
                argumentField={this.props.argumentField}
                {...serie}
            />
        )
    }

    render() {
        const { chartData, series } = this.props

        return (
            <Paper>
                <Chart data={chartData}>
                    <ArgumentAxis />
                    <ValueAxis />
                    {this.renderSeries(series)}
                    <Animation />
                    <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                    <Title text={this.props.title} />
                    <Stack />
                </Chart>
            </Paper>
        )
    }
}
