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

  handlePaletteSearch = (pickers) => {
    this.resetAlbums();
    let paletteSize;
    // Check for duplicates
    const colors = pickers.map((picker) => picker.color);
    if (new Set(colors).size !== colors.length) {
      alert("Must query unique colors in your palette!");
      return;
    }
    paletteSize = pickers.length;
    this.paletteSearch(paletteSize, colors);
  };

  paletteSearch = (paletteSize, colors) => {
    let apiRequest = {
      paletteSize: paletteSize,
      colors: colors,
    };
    console.log(apiRequest);

    trackPromise(
      fetch("/palette_search", {
        method: "POST",
        body: JSON.stringify(apiRequest),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }).then((res) => {
        res.json().then((data) => {
          console.log(data);
          let albumGrids = data.data.map((albumGrid) =>
            this.sortByPopularity(albumGrid)
          );
          // data = this.sortByPopularity(data);
          this.setState({ albumGrids: albumGrids, gridTitles: data.titles });
        });
      })
    );
  };

  handleBrowse = (paletteSize, genre) => {
    this.resetAlbums();
    let filter;
    if (genre === "All Genres") {
      filter = null;
    } else {
      filter = {
        genres: genre,
      };
    }
    this.aggregate(filter, paletteSize);
  };

  aggregate = (filter, paletteSize) => {
    let apiRequest = {
      filter: filter,
      paletteSize: paletteSize,
    };
    trackPromise(
      fetch("/aggregate", {
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

  handleSearch = (searchType, paletteSize, search) => {
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
    console.log(filter);
    this.search(filter, paletteSize, albumSearch);
  };

  search = (filter, paletteSize, albumSearch) => {
    let apiRequest = {
      filter: filter,
      paletteSize: paletteSize,
    };
    trackPromise(
      fetch("/search", {
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
    console.log(data);
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
          onSearch={(searchType, paletteSize, search) =>
            this.handleSearch(searchType, paletteSize, search)
          }
          onBrowse={(paletteSize, genre) =>
            this.handleBrowse(paletteSize, genre)
          }
          onPaletteSearch={(pickers) => this.handlePaletteSearch(pickers)}
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
