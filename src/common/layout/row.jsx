import React from 'react'

export default props => (
    <div {...props} className={'row ' + props.className} >{props.children}</div>
)