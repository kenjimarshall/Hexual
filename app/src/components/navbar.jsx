import React, { Component } from "react";
import "./navbar.css";
import ColorPanel from "./colorPanel";
import Collapse from "@kunukn/react-collapse";

class Navbar extends Component {
  state = {
    title: "hexual",
    showColorPanel: false,
  };

  handleColorPanelClick = () => {
    this.setState({ showColorPanel: !this.state.showColorPanel });
  };

  render() {
    return (
      <main className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="display-1">Hexual</h1>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              className="nav-item nav-link mb-4"
              onClick={this.handleColorPanelClick}
            >
              Palette <span className="sr-only">(current)</span>
            </button>
            <button className="nav-item nav-link mb-4">Browse</button>
            <button className="nav-item nav-link mb-4">Search</button>
          </div>
        </div>
        <Collapse isOpen={this.state.showColorPanel}>
          <ColorPanel />
        </Collapse>
      </main>
    );
  }
}

export default Navbar;
