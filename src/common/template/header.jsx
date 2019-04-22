import React from 'react'

import Navbar from './NavBar'

export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'><b>Client</b></span>
            <span className='logo-lg'>
                <i className='fa fa-money'></i>
                <b> React</b> Client
            </span>
        </a>
        <nav className='navbar navbar-static-top'>
            <a className='sidebar-toggle' data-toggle='offcanvas'></a>
            <Navbar />
        </nav>
        
    </header>
)