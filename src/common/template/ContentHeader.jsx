import React from 'react'
import If from '../operator/If'

export default props => (
    <section className='content-header'>
        <h1 className="pull-left">{props.title} <small>{props.small}</small></h1>
        <h1 className='pull-right'>
            <If test={props.createMethod}>
                <button className="btn btn-primary pull-right" onClick={props.createMethod}>Adicionar</button>
            </If>
        </h1>
    </section>
)