import React, { Component } from "react";
import "./browsePanel.css";

class BrowsePanel extends Component {
  state = {
    genre: "All Genres",
    paletteSize: "four",
  };

  handlePaletteChange = ({ target }) => {
    this.setState({ paletteSize: target.value });
  };

  handleGenreChange = ({ target }) => {
    this.setState({ genre: target.value });
  };

  render() {
    return (
      <div className="col-12 d-flex justify-content-center mb-4">
        <form>
          <div className="form-row align-items-center mb-2">
            <div className="col-auto my-1">
              <select
                className="custom-select mr-sm-2"
                id="paletteSize"
                name="paletteSize"
                autoComplete="off"
                onChange={this.handlePaletteChange}
              >
                <option defaultValue value="four">
                  4 Colours
                </option>
                <option value="three">3 Colours</option>
                <option value="two">2 Colours</option>
                <option value="one">1 Colour</option>
              </select>
            </div>
            <div className="col-auto my-1">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  this.props.onBrowse(this.state.paletteSize, this.state.genre)
                }
              >
                Explore
              </button>
            </div>
          </div>
          <div className="form-group d-flex justify-content-center mb-5">
            <select
              className="custom-select mr-sm-2"
              id="selectGenre"
              autoComplete="off"
              onChange={this.handleGenreChange}
            >
              <option defaultValue value="All Genres">
                All Genres
              </option>
              <option value="rap">Hip-Hop</option>
              <option value="pop">Pop</option>
              <option value="metal">Metal</option>
            </select>
          </div>
        </form>
      </div>
    );
  }
}

export default BrowsePanel;
