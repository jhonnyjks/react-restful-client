import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { openCloseSideBar, openCloseMiniSideBar } from './templateActions'


class Header extends Component {
  render() {
    return (
      <nav className="main-header navbar navbar-expand navbar-green navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#!" className="nav-link nav-link--bg" onClick={(e) => this.props.openCloseSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
            <a href="#!" className="nav-link nav-link--sm" onClick={(e) => this.props.openCloseMiniSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <div className="navbar-nav ml-auto"></div>
      </nav>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar, openCloseMiniSideBar }, dispatch)
export default connect(null, mapDispatchToProps)(Header)