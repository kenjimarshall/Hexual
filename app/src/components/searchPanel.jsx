import React, { Component } from "react";

class SearchPanel extends Component {
  state = {
    searchType: "artist",
  };

  handleArtistSelect = () => {
    this.setState({ searchType: "artist" });
  };

  handleAlbumSelect = () => {
    this.setState({ searchType: "album" });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <form>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder={
                      this.state.searchType === "artist"
                        ? "Radiohead"
                        : "OK Computer"
                    }
                  ></input>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="search"
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
                    onChange={this.handleAlbumSelect}
                  ></input>
                  <label className="form-check-label" htmlFor="albumRadio">
                    Album
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPanel;
