import React from 'react'
import Grid from '../grid'
import If from '../../operator/If'

export default props => (
    <Grid cols={props.cols} {...props.grid}>
        <div className={`small-box material-item bg-${props.color}`} style={{ marginBottom: 0 }}>
            <div className='inner'>
                <h3>{props.value}</h3>
                <p>{props.text}</p>
            </div>
            <div className='icon'>
                <i className={props.icon}></i>
            </div>
            <If test={props.link}>
                <a className='small-box-footer' {...props.link}>
                {props.link ? props.link.title : 'Mais informações' } <i className='fa fa-arrow-circle-right'></i>
                </a>
            </If>
        </div>
    </Grid>
)