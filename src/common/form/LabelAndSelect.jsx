import React from 'react'
import Grid from '../layout/grid'

export default props => (
    <Grid cols={props.cols}>
        <div className='form-group'>
            <label htmlFor={props.name}>{props.label}</label>
            <select name={props.name} {...props.input}
                readOnly={props.readOnly} className="custom-select mb-3">
                <option value="">{props.placeholder}</option>
                {props.options && props.options.map(e => (<option key={e.id} value={e.id}>{e.name}</option>))}
            </select>
        </div>
    </Grid>
)