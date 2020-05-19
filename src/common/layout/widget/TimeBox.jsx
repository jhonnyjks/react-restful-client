import React, { Component } from 'react'
import InfoBox from './InfoBox'

class TimeBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "--/--/-- --:--",
            day_week: ""
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        var days = [
            'Domingo',
            'Segunda-Feira',
            'Terça-Feira',
            'Quarta-Feira',
            'Quinta-Feira',
            'Sexta-Feira',
            'Sabado'
        ];
        this.setState({
            date: new Date().toLocaleString(),
            day_week: days[new Date().getDay()]
        });
    }

    render() {
        return (
            <InfoBox grid={this.props.grid}
                icon='fa fa-clock'
                bg='primary'
                title={this.state.day_week}
                text={this.state.date}
            />
        );
    }
}

export default TimeBox;