import React from 'react'

export default props => (
    <section {...props} className={'content ' + (props.className || '') } style={{paddingBottom: '40px', float: 'left', width: '100%'}}>
        <div className="container-fluid">
            {props.children}
        </div>
    </section>
)