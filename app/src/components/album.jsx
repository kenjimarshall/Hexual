import React, { Component } from "react";
import "./album.css";
import ntc from "./ntc.js";
import spotify from "./spotify.png";

class Album extends Component {
  state = {
    name: this.props.name,
    artist: this.props.artist,
    year: this.props.year,
    spotifyUrl: this.props.spotifyUrl,
    palette: this.props.palette,
    genres: this.props.genres,
    artworkUrl: this.props.artworkUrl,
  };

  handleColorClick = (palette_color) => {
    const color = palette_color.slice(1);
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = color;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  render() {
    return (
      <div className="col-12 col-sm-6 col-lg-4 d-flex album-holder">
        <figure className="figure">
          <a href={this.state.artworkUrl}>
            <img
              className="mx-auto d-block album-image"
              src={this.state.artworkUrl}
              alt={this.formatName()}
            />
          </a>
          <figcaption className="figure-caption">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <h5 className="d-inline my-1 flex-grow-1 text-truncate">
                {this.formatName()}
              </h5>
              <a className="d-inline" href={this.state.spotifyUrl}>
                <img
                  className="spotify-logo d-inline"
                  alt="Spotify"
                  src={spotify}
                ></img>
              </a>
            </div>
            <p className="text-truncate">
              <i>
                {this.formatArtist()} ({this.state.year})
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
    const { name } = this.state;
    return name === "" ? "Starman" : name;
  }

  formatArtist() {
    const { artist } = this.state;
    return artist === "" ? "Davie Bowie" : artist;
  }

  formatGenres() {
    const { genres } = this.state;
    if (!genres) {
      return "Genres unlisted";
    } else {
      return genres.slice(0, 2).join(" | "); // first two genres max
    }
  }

  formatPalette() {
    const { palette } = this.state;
    if (!palette) {
      return <div className="flex-fill"></div>;
    } else {
      return palette.map((palette_color) => (
        <div
          onClick={() => this.handleColorClick(palette_color)}
          className="flex-fill color-in-bar"
          style={{ background: palette_color }}
          data-toggle="tooltip"
          data-placement="right"
          data-html="true"
          title={
            palette_color +
            " " +
            ntc.name(palette_color)[1] +
            "<br>(Click to copy)"
          }
          key={palette_color}
        />
      ));
    }
  }
}

export default Album;
