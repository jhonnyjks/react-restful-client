import React from 'react'
import Menu from './Menu'

export default props => (
    <aside className='main-sidebar sidebar-dark-primary elevation-4'>
        <a href="index3.html" className="brand-link">
            <span className="brand-text font-weight-light text-center">{process.env.REACT_APP_NAME}</span>
        </a>
        <div className='sidebar'>
            <Menu />
        </div>
    </aside>
)