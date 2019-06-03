import React from 'react'

import env from '../../app/env'
import Navbar from './NavBar'

export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'><b>{env.APP_MIN_NAME}</b></span>
            <span className='logo-lg'>
                {env.APP_NAME}
            </span>
        </a>
        <nav className='navbar navbar-static-top'>
            <a className='sidebar-toggle' data-toggle='offcanvas'></a>
            <Navbar />
        </nav>

    </header>
)