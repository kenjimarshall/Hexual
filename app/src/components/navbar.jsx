import React, { Component } from "react";
import "./navbar.css";
import ColorPanel from "./colorPanel";
import Collapse from "@kunukn/react-collapse";
import SearchPanel from "./searchPanel";
import BrowsePanel from "./browsePanel";

class Navbar extends Component {
  state = {
    showColorPanel: false,
    showSearchPanel: false,
    showBrowsePanel: false,
  };

  handleColorPanelClick = () => {
    this.setState({
      showSearchPanel: false,
      showBrowsePanel: false,
      showColorPanel: !this.state.showColorPanel,
    });
  };

  handleSearchPanelClick = () => {
    this.setState({
      showColorPanel: false,
      showBrowsePanel: false,
      showSearchPanel: !this.state.showSearchPanel,
    });
  };

  handleBrowseClick = () => {
    this.setState({
      showColorPanel: false,
      showSearchPanel: false,
      showBrowsePanel: !this.state.showBrowsePanel,
    });
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
            <button
              className="nav-item nav-link mb-4"
              onClick={this.handleSearchPanelClick}
            >
              Search
            </button>
            <button
              className="nav-item nav-link mb-4"
              onClick={this.handleBrowseClick}
            >
              Browse
            </button>
          </div>
        </div>
        <Collapse isOpen={this.state.showColorPanel}>
          <ColorPanel
            onPaletteSearch={(pickers) => this.props.onPaletteSearch(pickers)}
          />
        </Collapse>
        <Collapse isOpen={this.state.showSearchPanel}>
          <SearchPanel
            onSearch={(searchType, paletteSize, search) =>
              this.props.onSearch(searchType, paletteSize, search)
            }
          />
        </Collapse>
        <Collapse isOpen={this.state.showBrowsePanel}>
          <BrowsePanel
            onBrowse={(paletteSize, genre) =>
              this.props.onBrowse(paletteSize, genre)
            }
          />
        </Collapse>
      </main>
    );
  }
}

export default Navbar;
