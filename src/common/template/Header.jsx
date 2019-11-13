import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Navbar from "./NavBar";
import { openCloseSideBar } from './templateActions'


class Header extends Component {
  render() {
    return (
      <nav className="main-header navbar navbar-expand navbar-green navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#!" className="nav-link" onClick={() => this.props.openCloseSideBar()} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <Navbar />
      </nav>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar }, dispatch)
export default connect(null, mapDispatchToProps)(Header)