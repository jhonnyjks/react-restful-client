import React from 'react'
import If from '../operator/If'

import { createBrowserHistory } from 'history'
const history = createBrowserHistory();

export default props => (
    <section className='content-header'>
        <div className="container-fluid">
        <div className="row">
            <div className="col-sm-6">
                <h1 className="pull-left">{props.title} <small style={{fontSize: 15}}>{props.small}</small></h1>
            </div>
            <div className="col-sm-6">
                <h1 className='pull-right'>
                <button type='button' className='btn' title='Baixar imagem do conteúdo'>
                    <i className='fa fa-download'></i>
                </button>
                <If test={!props.createMethod}>
                    <button type='button' className='btn btn-default' onClick={function(){ history.go()}}>Voltar</button>
                </If>
                    <If test={props.createMethod}>
                        <button className="btn btn-primary pull-right" onClick={props.createMethod}>Adicionar</button>
                    </If>
                </h1>
            </div>
        </div>
        </div>
    </section>
)