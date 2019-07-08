import React from "react";

import Navbar from "./NavBar";
const img = process.env.REACT_APP_LOGO;

export default props => (
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
    <nav className="navbar navbar-static-top">
      <a className="sidebar-toggle" data-toggle="offcanvas" />
      <Navbar />
    </nav>
  </header>
);