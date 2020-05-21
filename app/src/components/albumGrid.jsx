import React, { Component } from "react";
import Album from "./album";

class AlbumGrid extends Component {
  state = {
    displayAlbums: this.props.albums.slice(0, 50),
    cacheAlbums: this.props.albums.slice(50, -1),
  };

  extendDisplay = () => {
    let displayAlbums = [...this.state.displayAlbums];
    let cacheAlbums = [...this.state.cacheAlbums];
    displayAlbums = [...displayAlbums, ...cacheAlbums.slice(0, 50)];
    cacheAlbums = cacheAlbums.slice(50, -1);
    this.setState({
      displayAlbums,
      cacheAlbums,
    });
  };

  render() {
    return (
      <div className="row d-flex justify-content-center">
        <div className="col-12 text-center mb-4">
          <h1>{this.formatTitle()}</h1>
        </div>
        {this.state.displayAlbums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
        {this.state.cacheAlbums.length > 0 && (
          <div className="col-12 text-center my-4">
            <button className="btn btn-light" onClick={this.extendDisplay}>
              More
            </button>
          </div>
        )}
      </div>
    );
  }

  formatTitle = () => {
    let title = this.props.title;
    if (title === null) {
      return "Results";
    } else {
      return title;
    }
  };
}

export default AlbumGrid;
