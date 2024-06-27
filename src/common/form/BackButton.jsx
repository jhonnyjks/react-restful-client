import React, { Component } from 'react';

export default class BackButton extends Component {
  static contextTypes = {
    router: () => null, 
  }

  render() {
   
    const buttonStyle = {
      width: '110px',
      height: '48px',
      padding: '12px 24px',
      borderRadius: '4px',
      borderWidth: '1px',
      borderColor: '#6C757D',
      borderStyle: 'solid', 
      opacity: 1, 
      display: 'inline-block',
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      verticalAlign: 'middle',
    };

    const textStyle = {
      fontFamily: 'Source Sans Pro, sans-serif',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#343A40', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    };

    return (
      <button
        type='button' 
        className={`btn btn-default ${this.props.className}`}
        style={buttonStyle} 
        onClick={this.context.router.history.goBack}
      >
        <span style={textStyle}>{this.props.label}</span>
      </button>
    );
  }
}
