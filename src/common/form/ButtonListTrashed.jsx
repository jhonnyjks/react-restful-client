import React, { Component } from 'react'

export default class ButtonListTrashed extends Component {    


    constructor(props) {
        super(props);
        this.state = {
            isHovered: false, 
            isClicked: false,
            estiloBase: {
              //  padding: '10px 20px',
               // backgroundColor: 'blue',
                color: 'darkgrey ',
                border: 'none',
                cursor: 'pointer'

            }, 
            estiloHover: {
                //backgroundColor: 'darkblue'
                 color: 'gold',
            },

        };
    }    
  

    click(){
        if(this.state.isClicked){
            this.setState({ isClicked: false })
        }else{
            this.setState({ isClicked: true })
            
        }
    }


  
    render() {

      return (
        <button title={this.props.title} type='button' onClick={() => this.props.onListTrashed()}
            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }} >            
            {this.props.label}
            <i 
               className='fas fa-trash-restore'
               style={this.state.isHovered ? {...this.state.estiloBase, ...this.state.estiloHover} : this.state.estiloBase}
               onMouseEnter={() => this.setState({ isHovered: true }) }
               onMouseLeave={!this.state.isClicked ? () => this.setState({ isHovered: false }) : () => this.setState({ isHovered: true })   }
               onMouseDown={() => this.click()}
               >
            </i>
        </button>
      )
    };
  }