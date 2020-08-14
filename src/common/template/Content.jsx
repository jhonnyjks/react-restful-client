import React from 'react'

export default props => (
    <section className='content' style={{paddingBottom: '40px'}}>
        <div className="container-fluid">
            {props.children}
        </div>
    </section>
)