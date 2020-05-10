import React, { Component } from "react";
import Album from "./album";

class AlbumGrid extends Component {
  state = {
    albums: [
      {
        id: 0,
        name: "Kierkegaard's Waltz asdfasd;kjfsa;dlldj",
        artist: "Jesus Chriasd;flksa;dlkfjsad;lkfjdsa;lfkdsajst",
        year: "2020",
        spotifyUrl: "https://open.spotify.com/album/0EaaLMICMb9R4j9tqt7ewv",
        palette: ["#581c4f", "#31339e", "#c3bad1"],
        genres: ["Hip-hop", "Folk", "Rock"],
        artworkUrl:
          "https://i.scdn.co/image/ab67616d00001e02931d20d076fe021323e63f69",
      },
      {
        id: 1,
        name: "Kierkegaard's Waltz asdfasd;kjfsa;dlldj",
        artist: "Jesus Chriasd;flksa;dlkfjsad;lkfjdsa;lfkdsajst",
        year: "2020",
        spotifyUrl: "https://open.spotify.com/album/0EaaLMICMb9R4j9tqt7ewv",
        palette: ["#581c4f", "#31339e", "#c3bad1"],
        genres: ["Hip-hop", "Folk", "Rock"],
        artworkUrl:
          "https://i.scdn.co/image/ab67616d00001e02931d20d076fe021323e63f69",
      },
      {
        id: 2,
        name: "Kierkegaard's Waltz asdfasd;kjfsa;dlldj",
        artist: "Jesus Chriasd;flksa;dlkfjsad;lkfjdsa;lfkdsajst",
        year: "2020",
        spotifyUrl: "https://open.spotify.com/album/0EaaLMICMb9R4j9tqt7ewv",
        palette: ["#581c4f", "#31339e", "#c3bad1"],
        genres: ["Hip-hop", "Folk", "Rock"],
        artworkUrl:
          "https://i.scdn.co/image/ab67616d00001e02931d20d076fe021323e63f69",
      },
    ],
  };
  render() {
    return (
      <div className="row">
        {this.state.albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    );
  }
}

export default AlbumGrid;
