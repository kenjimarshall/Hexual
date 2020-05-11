import React, { Component } from "react";
import Album from "./album";

class AlbumGrid extends Component {
  render() {
    return (
      <div className="row d-flex justify-content-center">
        <div className="col-12 text-center mb-4">
          <h1 className="display-4">{this.formatTitle()}</h1>
        </div>
        {this.props.albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
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
