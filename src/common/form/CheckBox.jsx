import React, { Component } from 'react'

export default class CheckBox extends Component {

    render() {
        return (
            <input className='center-block' type="checkbox" value={this.props.value}
                checked={this.props.checked} onChange={this.props.handleChange} />
        )
    }
}