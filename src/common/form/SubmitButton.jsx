import React, { Component } from 'react';

export default class SubmitButton extends Component {
  render() {   
    const buttonStyle = {
      width: '93px',
      height: '48px',
      padding: '12px 24px',
      gap: '8px',
      borderRadius: '4px',
      backgroundColor: '#0D6EFD', 
      border: 'none', 
      cursor: 'pointer', 
    };

    const textStyle = {
      fontFamily: 'Source Sans Pro, sans-serif',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#F8F9FA' 
    };

    return (
      <button 
        type='submit' 
        className={`btn ${this.props.className}`}
        style={buttonStyle} 
      >
        <span style={textStyle}>{this.props.label}</span>
      </button>
    );
  }
}
