import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { openCloseSideBar } from './templateActions'

class MenuItem extends Component {
    render() {
        return (
            <li className="nav-item">
                <Link to={this.props.path} className="nav-link">
                    <i className={`nav-icon fas fa-${this.props.icon}`}></i> <span>{this.props.label}</span>
                </Link>
            </li>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar }, dispatch)
export default connect(null, mapDispatchToProps)(MenuItem)