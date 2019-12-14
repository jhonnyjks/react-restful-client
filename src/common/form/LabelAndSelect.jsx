import React, { Component } from 'react'
import Grid from '../layout/grid'

class LabelAndSelect extends Component {
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
        if (nextProps.error) {      
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
    }

    render() {
        return (
            <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <select name={this.props.name} {...this.props.input}
                        readOnly={this.props.readOnly} className={`custom-select mb-3 ${this.state.error.flag === true ? `is-invalid` : ``}`}>
                        <option value="">{this.props.placeholder}</option>
                        {this.props.options && this.props.options.map(e => (<option key={e.id} value={e.id}>{e.name}</option>))}
                    </select>
                    <div className="invalid-feedback">
                        {this.state.error.flag === true ? this.state.error.message : "Campo inválido"}
                    </div>
                </div>
            </Grid>
        );
    }
}

export default LabelAndSelect;