import React, { Component } from 'react'

export default class ButtonListTrashed extends Component {    


    constructor(props) {
        super(props);
        this.state = {
            isHovered: false, 
            isClicked: false,
            estiloBase: {
                color: 'darkgrey ',
                border: 'none',
                cursor: 'pointer'

            }, 
            estiloHover: {              
                 color: 'gold',
            },
            onColor: false

        };
    } 
  
    render() {

      return (
        <button title={this.props.title} type='button' onClick={() => this.props.onListTrashed()}
            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }} >            
            {this.props.label}
            <i 
               className='fas fa-trash-restore'
               style={!this.props.onColorResolve && !this.state.isHovered ?  this.state.estiloBase : {...this.state.estiloBase, ...this.state.estiloHover}}
               onMouseEnter={() => this.setState({ isHovered: true }) }
               onMouseLeave={!this.props.onColorResolve ? () => this.setState({ isHovered: false }) : () => this.setState({ isHovered: true })   }
                           
               >
            </i>
        </button>
      )
    };
  }