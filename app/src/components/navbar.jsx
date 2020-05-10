import React, { Component } from "react";

class Navbar extends Component {
  state = {
    title: "hexual",
  };
  render() {
    return (
      <nav className="navbar navbar-light bg-white">
        <span className="navbar-brand mb-0">
          <h1 className="display-2">Hexual</h1>
        </span>
      </nav>
    );
  }
}

export default Navbar;
