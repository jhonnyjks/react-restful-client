import React, { Component } from 'react'

export default class BackButton extends Component {
    static contextTypes = {
      router: () => null, // replace with PropTypes.object if you use them
    }
  
    render() {
      return (
        <button
            type='button' className='btn btn-default'
            onClick={this.context.router.history.goBack}>
            {this.props.label}
        </button>
      )
    }
  }