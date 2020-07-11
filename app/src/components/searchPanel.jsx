import React, { Component } from "react";
import "./searchPanel.css";
import $ from "jquery";

class SearchPanel extends Component {
  state = {
    searchType: "artist",
    search: null,
  };

  handleArtistSelect = () => {
    this.setState({ searchType: "artist" });
  };

  handleAlbumSelect = () => {
    this.setState({ searchType: "album" });
  };

  handleSearchChange = ({ target }) => {
    this.setState({ search: target.value });
  };

  render() {
    return (
      <div className="col-12 d-flex justify-content-center">
        <form>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                id="search"
                autoComplete="off"
                className="form-control search"
                placeholder={this.formatPlaceholder()}
                onChange={this.handleSearchChange}
                name="search"
              ></input>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    this.props.onSearch(
                      this.state.searchType,
                      this.state.search
                    )
                  }
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="form-group d-flex justify-content-center mb-5">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="searchRadios"
                id="artistRadio"
                value="artist"
                autoComplete="off"
                defaultChecked
                onChange={this.handleArtistSelect}
              ></input>
              <label className="form-check-label" htmlFor="artistRadio">
                Artist
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="searchRadios"
                id="albumRadio"
                value="album"
                autoComplete="off"
                onChange={this.handleAlbumSelect}
              ></input>
              <label className="form-check-label" htmlFor="albumRadio">
                Album
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }

  formatPlaceholder() {
    return this.state.searchType === "artist" ? "Radiohead" : "OK Computer";
  }
}

$(function () {
  $("select").on("change", function () {
    $(this).blur();
  });
});

$(function () {
  $("form").submit(function () {
    $(this).parent().find("input").blur();
    $(this).parent().find("button").click();
    return false;
  });
});

export default SearchPanel;
