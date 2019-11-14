import React from 'react'
import { Link } from 'react-router-dom'

export default props => (
    <li className='nav-item has-treeview menu-open'>
        <Link to='' className="nav-link">
            <i className={`fa fa-${props.icon}`}></i> <span>{props.label}</span>
            <i className='fa fa-angle-left pull-right'></i>
        </Link>
        <ul className='nav nav-treeview'>
            {props.children}
        </ul>
    </li>
)