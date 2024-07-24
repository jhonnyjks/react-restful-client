import React from 'react'
import If from '../operator/If'

import { createBrowserHistory } from 'history'
const history = createBrowserHistory();
console.log('width',window.innerWidth);
export default props => (
    <section className='content-header'>
        <div className="container-fluid">
        <div className="row mb-2">
            <div className="col-sm-6">
                <h1 className="pull-left" style={{lineHeight:'1em'}}>
                    <strong className={`${window.innerWidth < 762?'d-block':''}`}>{props.title}</strong> 
                    <small style={{fontSize: 15}}>{props.small}</small>
                </h1>
            </div>
            <div className="col-sm-6">
                <h1 className=''>
                <If test={props.backButton}>
                    <button type='button' className='btn btn-default' onClick={function(){ history.go()}}>Voltar</button>
                </If>
                    <If test={props.createMethod}>
                        <button className={`btn btn-primary pull-right ${window.innerWidth < 762?'btn-block':''}`} onClick={props.createMethod}>Adicionar</button>
                    </If>
                </h1>
            </div>
        </div>
        </div>
    </section>
)