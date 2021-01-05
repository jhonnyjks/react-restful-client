import React from 'react'
import Grid from '../grid'
import If from '../../operator/If'

export default props => (
    <Grid {...props.grid}>
        <div className={`box box-warning material-item bg-${props.color}`} style={{ marginBottom: 0 }}>

            <div className='box-header with-border'>
                <h3 className='box-title' style={{display:'initial'}}>{props.title}</h3>
                <div className='box-tools pull-right'>
                    <button onClick={collapse} type='button' className='btn btn-box-tool' data-widget='collapse'><i className='fa fa-minus'></i>
                    </button>
                </div>
            </div>

            <div className='box-body' style={{color:'#222'}}>
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

const collapse = e => {

    console.log(e.target)
    let el = e.target.parentElement.parentElement.parentElement
    if(el.className. indexOf('box-header') > -1) el = el.parentElement

    if(el.className.indexOf('collapsed-box') < 0) {
        el.className = el.className + ' collapsed-box'
    } else {
        el.className = el.className.replace(' collapsed-box', '')
    }
}