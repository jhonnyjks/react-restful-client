import React from 'react'
import If from '../operator/If'

export default props => (
    <section className='content-header'>
        <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 className="pull-left">{props.title} <small>{props.small}</small></h1>
            </div>
            <div class="col-sm-6">
                <h1 className='pull-right'>
                    <If test={props.createMethod}>
                        <button className="btn btn-primary pull-right" onClick={props.createMethod}>Adicionar</button>
                    </If>
                </h1>
            </div>
        </div>
        </div>
    </section>
)