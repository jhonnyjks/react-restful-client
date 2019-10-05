import React from 'react'
import Grid from '../grid'
import If from '../../operator/If'

export default props => (
    <Grid {...props.grid}>
        <div className={`box box-warning material-item bg-${props.color}`} style={{ marginBottom: 0 }}>

            <div className='box-header with-border'>
                <h3 className='box-title'>{props.title}</h3>
                <div className='box-tools pull-right'>
                    <button type='button' className='btn btn-box-tool' data-widget='collapse'><i className='fa fa-minus'></i>
                    </button>
                </div>
            </div>

            <div className='box-body'>
                {props.children}
            </div>

            <If test={props.loading}>
                <div class="overlay">
                    <i class="fa fa-refresh fa-spin"></i>
                </div>
            </If>
        </div>
    </Grid>
)