import React from 'react'
import Grid from '../grid'

export default props => (
    <Grid cols={props.cols}>
        <div className={`small-box material-item bg-${props.color}`} style={{ marginBottom: 0 }}>
            <div className='inner'>
                <h3>{props.value}</h3>
                <p>{props.text}</p>
            </div>
            <div className='icon'>
                <i className={`fa fa-${props.icon}`}></i>
            </div>
        </div>
    </Grid>
)