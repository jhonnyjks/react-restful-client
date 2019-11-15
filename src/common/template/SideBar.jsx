import React from 'react'
import Menu from './Menu'

export default props => (
    <aside className='main-sidebar sidebar-dark-success elevation-4'>
        <a href="#!" className="brand-link">
            <img src="http://lorempixel.com/160/160/abstract" alt="AdminLTE Logo" className="brand-image img-circle elevation-3"
                style={{ opacity: .8 }}></img>
            <span className="brand-text font-weight-light text-center"><strong>{process.env.REACT_APP_NAME}</strong></span>
        </a>
        <div className='sidebar sidebar--sema'>
            <Menu />
        </div>
    </aside>
)