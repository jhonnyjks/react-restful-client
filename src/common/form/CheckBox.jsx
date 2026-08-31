import React, { Component } from 'react'

export default class CheckBox extends Component {

    render() {
        return (
            <input className='center-block' type="checkbox" name={this.props.name} value={this.props.value}
                checked={this.props.checked} onChange={this.props.onChange || this.props.handleChange} style={this.props.style}/>
        )
    }
}