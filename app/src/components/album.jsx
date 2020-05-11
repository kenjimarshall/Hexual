import React, { Component } from "react";
import "./album.css";
import ntc from "./ntc.js";
import spotify from "./spotify.png";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

class Album extends Component {
  handleColorClick = (palette_color) => {
    console.log("Copying...");
    const color = palette_color.slice(1);
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = color;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  render() {
    return (
      <div className="col-12 col-md-6 col-lg-4 d-flex album-holder">
        <figure className="figure">
          <a href={this.props.album.artworkUrl}>
            <img
              className="mx-auto d-block album-image"
              src={this.props.album.artworkUrl}
              alt={this.formatName()}
            />
          </a>
          <figcaption className="figure-caption">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <h6 className="d-inline my-1 flex-grow-1 text-truncate">
                {this.formatName()}
              </h6>
              <a className="d-inline" href={this.props.album.spotifyUrl}>
                <img
                  className="spotify-logo d-inline"
                  alt="Spotify"
                  src={spotify}
                ></img>
              </a>
            </div>
            <p className="text-truncate mt-1">
              <i>
                {this.formatArtist()} ({this.props.album.year})
              </i>
              <br></br>
              {this.formatGenres()}
            </p>
          </figcaption>
        </figure>
        <div className="palette ml-2 d-flex flex-column">
          {this.formatPalette()}
        </div>
      </div>
    );
  }

  formatName() {
    const { name } = this.props.album;
    return name === "" ? "Starman" : name;
  }

  formatArtist() {
    const { artist } = this.props.album;
    return artist === "" ? "Davie Bowie" : artist;
  }

  formatGenres() {
    const { genres } = this.props.album;
    if (!genres) {
      return "Genres unlisted";
    } else {
      return genres.slice(0, 2).join(" | "); // first two genres max
    }
  }

  formatPalette() {
    const { palette } = this.props.album;
    if (!palette) {
      return <div className="flex-fill"></div>;
    } else {
      return palette.map((palette_color) => (
        <Tooltip
          className="flex-fill color-in-bar"
          style={{ background: palette_color, cursor: "pointer" }}
          key={palette_color}
          position="right"
          trigger="mouseenter"
          html={
            <div>
              {palette_color + " " + ntc.name(palette_color)[1]}
              <br></br>
              (Click to copy)
            </div>
          }
        >
          <div
            className="w-100, h-100"
            onClick={() => this.handleColorClick(palette_color)}
          ></div>
        </Tooltip>
      ));
    }
  }
}

export default Album;
