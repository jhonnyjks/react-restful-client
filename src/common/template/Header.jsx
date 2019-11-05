import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Navbar from "./NavBar";
import { openCloseSideBar } from './templateActions'

const img = process.env.REACT_APP_LOGO;

class Header extends Component {
  render () {
      return (
      <header className="main-header">
        <a href="/#/" className="logo">
          <span className="logo-mini">
            <img alt='Logo' src={img} height={35} width={35} />
          </span>
          <span className="logo-lg">
            <img alt='Logo' src={img} height={35} width={35} />
            {process.env.REACT_APP_NAME}
          </span>
        </a>
        <nav className="navbar navbar-static-top" onClick={() => this.props.openCloseSideBar()}>
          <a href="!#" className="sidebar-toggle">toggle</a>
          <Navbar />
        </nav>
      </header>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar }, dispatch)
export default connect(null, mapDispatchToProps)(Header)