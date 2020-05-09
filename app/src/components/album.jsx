import React, { Component } from "react";
import "./album.css";
import ntc from "./ntc.js";

class Album extends Component {
  state = {
    name: "Kierkegaard's Waltz",
    artist: "Jesus Christ",
    year: "2020",
    spotifyUrl: "https://open.spotify.com/album/0EaaLMICMb9R4j9tqt7ewv",
    palette: ["#581c4f", "#31339e", "#c3bad1"],
    genres: ["Hip-hop", "Folk", "Rock"],
    artworkUrl:
      "https://i.scdn.co/image/ab67616d00001e02931d20d076fe021323e63f69",
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
      <div className="col-10 offset-1 d-flex album-holder">
        <figure className="figure">
          <img
            className="mx-auto d-block album-image"
            src={this.state.artworkUrl}
            alt={this.formatName()}
          />
          <figcaption className="figure-caption">
            <h5>{this.formatName()}</h5>
            <p>
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
