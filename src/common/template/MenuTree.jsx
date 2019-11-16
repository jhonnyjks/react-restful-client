import React from 'react'
import { Link } from 'react-router-dom'

export default class MenuTree extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    openClose = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        return (
            <li className={`nav-item has-treeview ${this.state.open ? 'menu-open' : ''}`}>
                <Link to='#!' className={`nav-link ${this.state.open ? 'active' : ''}`} onClick={() => this.openClose()}>
                    <i className={`nav-icon fa fa-${this.props.icon}`}></i> <span>{this.props.label}</span>
                    <i className='right fas fa-angle-left'></i>
                </Link>
                <ul className='nav nav-treeview'>
                    {this.props.children}
                </ul>
            </li>
        )
    }
}