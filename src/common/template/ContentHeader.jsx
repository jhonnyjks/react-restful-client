import React from 'react'

export default props => (
    <section className='content-header'>
        <h1 className="pull-left">{props.title} <small>{props.small}</small></h1>
        <h1 className='pull-right'>
           <a className="btn btn-primary pull-right" onClick={props.createMethod}>Adicionar</a>
        </h1>
    </section>
)