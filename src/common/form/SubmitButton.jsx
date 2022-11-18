import React, { Component } from 'react'

export default class SubmitButton extends Component {
    static contextTypes = {
      router: () => null, // replace with PropTypes.object if you use them
    }
  
    render() {
      const pathname = this.context.router.route.location.pathname

      return (
        <button
            type='submit' className='btn btn-primary'
            onClick={ e => pathname !== false ? this.context.router.history.push(pathname.substring(0, pathname.lastIndexOf('/'))) : null }>
            {this.props.label}
        </button>
      )
    }
  }