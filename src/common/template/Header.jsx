import React from "react";

import Navbar from "./NavBar";
const img = require("../../assets/marca.png");

export default props => (
  <header className="main-header">
    <a href="/#/" className="logo">
      <span className="logo-mini">
        <img src={img} height={30} width={50} />
      </span>
      <span className="logo-lg">
        <img src={img} height={30} width={50} />
        {process.env.REACT_APP_NAME}
      </span>
    </a>
    <nav className="navbar navbar-static-top">
      <a className="sidebar-toggle" data-toggle="offcanvas" />
      <Navbar />
    </nav>
  </header>
);