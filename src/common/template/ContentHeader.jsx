import React from 'react'

export default props => (
    <section className='content-header'>
        <h1 className="pull-left">{props.title} <small>{props.small}</small></h1>
        <h1 className='pull-right'>
           <button className="btn btn-primary pull-right" onClick={props.createMethod}>Adicionar</button>
        </h1>
    </section>
)