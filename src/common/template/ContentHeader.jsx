import React, { Component } from 'react';
import If from '../operator/If'

import { createBrowserHistory } from 'history'
const history = createBrowserHistory();

export default class  ContentHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            width: 0,
            height: 0,
        };


        window.addEventListener("resize", () => {
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        });
    }

    componentDidMount() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    
        }
    


    render(){
        return (
            <section className='content-header'>
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="pull-left" style={{lineHeight:'1em'}}>
                            <strong className={`${this.state.width < 600?'d-block':''}`}>{this.props.title}</strong> 
                            <small style={{fontSize: 15}}> {this.props.small}</small>
                        </h1>
                    </div>
                    <div className="col-sm-6">
                        <h1 className=''>
                        <If test={this.props.backButton}>
                            <button type='button' className='btn btn-default' onClick={function(){ history.go()}}>Voltar</button>
                        </If>
                            <If test={this.props.createMethod}>
                                <button className={`btn btn-primary pull-right ${this.state.width < 600?'btn-block':''}`} onClick={this.props.createMethod}>Adicionar</button>
                            </If>
                        </h1>
                    </div>
                </div>
                </div>
            </section>
        )
    }
}