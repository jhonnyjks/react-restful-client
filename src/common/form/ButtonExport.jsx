import React, { Component } from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default class ButtonExport extends Component {    


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
                 color: 'green',
            },
            onColor: false

        };
    } 
    
    getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    };

    transformData = (head, body) => {
        return body.map(row => {
            let newRow = {};
            for (let key in head) {
                let value = this.getNestedValue(row, key);
                if(head && head[key] && head[key].callback){
                    let valueCalback = head[key].callback(value,row);
                    console.log(typeof valueCalback,valueCalback);
                    
                    newRow[head[key].title || head[key]] = (typeof valueCalback != 'object') ?valueCalback:value;
                }else{
                    newRow[head[key].title || head[key]] = value;
                }

            }
            return newRow;
        });
    };

    exportToExcel = () => {
        const head = this.props.head;
        const body = this.props.body;
        
        const data = this.transformData(head,body);
    
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
        saveAs(dataBlob, 'arquivo.xlsx');
    };
  
    render() {

      return (
        <button title={this.props.title} type='button' onClick={this.exportToExcel}
            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }} >            
            {this.props.label}
            <i 
               className='fas fa-file-excel'
               style={!this.props.onColorResolve && !this.state.isHovered ?  this.state.estiloBase : {...this.state.estiloBase, ...this.state.estiloHover}}
               onMouseEnter={() => this.setState({ isHovered: true }) }
               onMouseLeave={!this.props.onColorResolve ? () => this.setState({ isHovered: false }) : () => this.setState({ isHovered: true })   }
                           
               >
            </i>
        </button>
      )
    };
  }