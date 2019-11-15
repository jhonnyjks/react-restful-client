import React from 'react'
import Grid from '../grid'
import If from '../../operator/If'

export default props => (
    <Grid {...props.grid}>
        <div className={`info-box bg-${props.bg || ' '}`} style={{ marginBottom: 0 }} >
            <span
                className={`info-box-icon bg-${props.iconBg || ' '}`}
                style={{ borderRadius: '3px 0 0 3px' }}
            >
                <i className={props.icon}></i>
            </span>

            <div className='info-box-content'>
                <span className='info-box-text' style={{ fontWeight: 'bold' }}>{props.title}</span>

                <If test={props.text}>
                    <span className='info-box-number'>{props.text}</span>
                </If>

                <If test={props.content}>
                    {props.content}
                </If>

                <If test={props.progress}>
                    <div className='progress'>
                        <div className='progress-bar' style={{ width: props.progress }}></div>
                    </div>
                    <span className='progress-description'>
                        {props.progressText}
                    </span>
                </If>
            </div>

            <If test={props.loading}>
                <div className="overlay">
                    <i className="fa fa-refresh fa-spin"></i>
                </div>
            </If>
        </div>
    </Grid>
)