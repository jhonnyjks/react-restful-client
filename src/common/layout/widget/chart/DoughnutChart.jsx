import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    PieSeries,
    Title,
    Legend
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles'

const titleStyles = {
    title: {
        whiteSpace: 'pre',
        position: 'absolute',
        width: '87%',
        zIndex: 2,
        backgroundColor: '#ffffff8c',
        marginBottom: 0
    }
}

const TitleText = withStyles(titleStyles)(({ classes, ...props }) =>
    <Title.Text {...props} className={classes.title} />
)

const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        paddingBottom: 0,
        paddingTop: 0
    },
})

const legendLabelStyles = theme => ({
    label: {
        whiteSpace: 'nowrap',
        paddingTop: 0
    },
})

const legendItemStyles = () => ({
    item: {
        flexDirection: 'row',
        paddingRight: 0
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

export default class DoughnutChart extends React.PureComponent {

    render() {
        const { chart } = this.props

        return (
            <Paper>
                <Chart {...chart} >
                    <PieSeries
                        valueField={this.props.valueField}
                        argumentField={this.props.argumentField}
                        innerRadius={0.6}
                    />
                    <Title
                        text={this.props.title}
                        textComponent={TitleText}
                    />
                    <Legend position="right"
                        rootComponent={Root}
                        itemComponent={Item}
                        labelComponent={Label}
                    />
                    <Animation />
                </Chart>
            </Paper>
        )
    }
}
