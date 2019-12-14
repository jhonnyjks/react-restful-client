import React, { Component } from 'react'
import Grid from '../layout/grid'
export default class LabelAndInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: {
                message: null,
                flag: false
            }
        }
    }

    componentWillUpdate(nextProps) {
        if (this.state.error.flag === false) {
            if (Object.keys(nextProps.error).length > 0 && nextProps.error[this.props.input.name]) {
                this.setState({
                    error: {
                        message: nextProps.error[this.props.input.name][0],
                        flag: true
                    }
                })
            }
        } else {
            if (Object.keys(nextProps.error).length === 0 || nextProps.error[this.props.input.name] === undefined) {
                this.setState({
                    error: {
                        message: null,
                        flag: false
                    }
                })
            }
        }
    }

    render() {
        return (
            <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <input name={this.props.name} {...this.props.input} className={`form-control ${this.state.error.flag === true ? `is-invalid` : ``}`}
                        placeholder={this.props.placeholder}
                        readOnly={this.props.readOnly}
                        type={this.props.type} />
                    <div className="invalid-feedback">
                        {this.state.error.flag === true ? this.state.error.message : "Campo inválido"}
                    </div>
                </div>
            </Grid>
        )
    }
}