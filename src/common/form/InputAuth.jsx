import React from 'react'
import If from '../operator/If'
export default props => (
    <If test={!props.hide}>
        <div className="input-group mb-3 has-feedback">
            <input {...props.input}
                className='form-control'
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                type={props.type} />
            <div className="input-group-append">
                <div className="input-group-text">
                    <span className={`fas fa-${props.icon}`}></span>
                </div>
            </div>
        </div>
    </If>
)