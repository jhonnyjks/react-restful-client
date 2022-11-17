import React, { Component } from 'react'

export default class SubmitButton extends Component {
    static contextTypes = {
      router: () => null, // replace with PropTypes.object if you use them
    }
  
    render() {
      return (
        <button
            type='submit' className='btn btn-primary'
            onClick={this.context.router.history.goBack}>
            {this.props.label}
        </button>
      )
    }
  }