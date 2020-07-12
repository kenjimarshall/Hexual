import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import AlbumGrid from "./components/albumGrid";
import LoadingIndicator from "./components/loadingIndicator";
import { trackPromise } from "react-promise-tracker";
class App extends Component {
  state = {
    albumGrids: [],
    gridTitles: [],
  };

  gridIndices = 0; // manage keys for AlbumGrid as they're rendered

  resetAlbums = () => {
    this.setState({
      albumGrids: [],
      gridTitles: [],
    });
  };

  handlePaletteSearch = (pickers, genre) => {
    this.resetAlbums();
    // Check for duplicates
    const colors = pickers.map((picker) => picker.color);
    if (new Set(colors).size !== colors.length) {
      alert("Must query unique colors in your palette!");
      return;
    }
    this.paletteSearch(colors, genre);
  };

  paletteSearch = (colors, genre) => {
    let apiRequest = {
      colors: colors,
      genre: genre,
    };

    trackPromise(
      fetch("/api/palette_search", {
        method: "POST",
        body: JSON.stringify(apiRequest),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }).then((res) => {
        res.json().then((data) => {
          console.log("Results received");
          let albumGrids = data.data.map((albumGrid) =>
            this.sortByPopularity(albumGrid)
          );
          console.log("Results sorted");
          this.setState({ albumGrids: albumGrids, gridTitles: data.titles });
          console.log("State updated");
        });
      })
    );
  };

  handleBrowse = (genre) => {
    this.resetAlbums();
    this.aggregate(genre);
  };

  aggregate = (genre) => {
    let apiRequest = {
      genre: genre,
    };
    trackPromise(
      fetch("/api/aggregate", {
        method: "POST",
        body: JSON.stringify(apiRequest),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }).then((res) => {
        res.json().then((data) => {
          data = this.sortByPopularity(data);
          this.setState({ albumGrids: [data], gridTitles: [null] });
        });
      })
    );
  };

  handleSearch = (searchType, search) => {
    this.resetAlbums();
    let filter;
    let albumSearch;
    if (searchType === "artist") {
      albumSearch = false;
      filter = {
        $text: {
          $search: search,
        },
      };
    } else if (searchType === "album") {
      albumSearch = true;
      filter = {
        album: {
          $regex: "^" + search,
          $options: "i",
        },
      };
    }
    this.search(filter, albumSearch);
  };

  search = (filter, albumSearch) => {
    let apiRequest = {
      filter: filter,
    };
    trackPromise(
      fetch("/api/search", {
        method: "POST",
        body: JSON.stringify(apiRequest),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (albumSearch) {
            data = this.sortByPopularity(data);
          }
          this.setState({ albumGrids: [data], gridTitles: [null] });
        });
      })
    );
  };

  sortByPopularity = (data) => {
    return data.sort(function (a, b) {
      var x = a["popularity"];
      var y = b["popularity"];
      return x < y ? 1 : x > y ? -1 : 0;
    });
  };

  render() {
    return (
      <React.Fragment>
        <Navbar
          onSearch={(searchType, search) =>
            this.handleSearch(searchType, search)
          }
          onBrowse={(genre) => this.handleBrowse(genre)}
          onPaletteSearch={(pickers, genre) =>
            this.handlePaletteSearch(pickers, genre)
          }
        />
        <main className="container">
          <LoadingIndicator />
          {this.state.albumGrids.map((albums, index) => (
            <AlbumGrid
              key={this.gridIndices++}
              albums={albums}
              title={this.state.gridTitles[index]}
            />
          ))}
        </main>
      </React.Fragment>
    );
  }
}

export default App;
