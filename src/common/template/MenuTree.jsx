import React from 'react'
import { Link } from 'react-router-dom'

export default props => (
    <li className='treeview'>
        <Link to={props.path}>
            <i className={`fa fa-${props.icon}`}></i> <span>{props.label}</span>
            <i className='fa fa-angle-left pull-right'></i> 
        </Link>
        <ul className='treeview-menu'>
            {props.children}
        </ul>
    </li>
)