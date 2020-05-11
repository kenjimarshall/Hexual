import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import AlbumGrid from "./components/albumGrid";

class App extends Component {
  state = {
    albumGrids: [],
    gridTitles: [],
  };

  gridIndices = 0;

  handlePaletteSearch = (pickers) => {
    let filter, partialFilter, paletteSize;
    if (pickers.length === 1) {
      paletteSize = "one";
      filter = {
        "palettes.one": pickers.map((picker) => picker.color),
      };
      partialFilter = null;
    } else if (pickers.length === 2) {
      paletteSize = "two";
      filter = {
        "palettes.two": pickers.map((picker) => picker.color),
      };
      partialFilter = {
        $or: [
          { "palettes.two": { $all: [pickers[0].color] } },
          { "palettes.two": { $all: [pickers[1].color] } },
        ],
      };
    } else if (pickers.length === 3) {
      paletteSize = "three";
      filter = {
        "palettes.three": pickers.map((picker) => picker.color),
      };
      partialFilter = {
        $or: [
          { "palettes.three": { $all: [pickers[0].color, pickers[1].color] } },
          { "palettes.three": { $all: [pickers[0].color, pickers[2].color] } },
          { "palettes.three": { $all: [pickers[1].color, pickers[2].color] } },
        ],
      };
    } else if (pickers.length === 4) {
      paletteSize = "four";
      filter = {
        "palettes.four": pickers.map((picker) => picker.color),
      };
      partialFilter = {
        $or: [
          {
            "palettes.four": {
              $all: [pickers[0].color, pickers[1].color, pickers[2].color],
            },
          },
          {
            "palettes.four": {
              $all: [pickers[0].color, pickers[1].color, pickers[3].color],
            },
          },
          {
            "palettes.four": {
              $all: [pickers[0].color, pickers[2].color, pickers[3].color],
            },
          },
          {
            "palettes.four": {
              $all: [pickers[1].color, pickers[2].color, pickers[3].color],
            },
          },
        ],
      };
    }
    this.paletteSearch(paletteSize, filter, partialFilter);
  };

  paletteSearch = (paletteSize, filter, partialFilter) => {
    let apiRequest = {
      paletteSize: paletteSize,
      filter: filter,
      partialFilter: partialFilter,
    };
    console.log(apiRequest);

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
    });
  };

  handleBrowse = (paletteSize, genre) => {
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
    });
  };

  handleSearch = (searchType, paletteSize, search) => {
    console.log("Searching");
    let filter;
    if (searchType === "artist") {
      filter = { artist: search };
    } else if (searchType === "album") {
      filter = { album: search };
    }
    this.search(filter, paletteSize, search);
  };

  search = (filter, paletteSize) => {
    let apiRequest = {
      filter: filter,
      paletteSize: paletteSize,
    };

    fetch("/search", {
      method: "POST",
      body: JSON.stringify(apiRequest),
      headers: new Headers({
        "content-type": "application/json",
      }),
    }).then((res) => {
      res.json().then((data) => {
        this.setState({ albumGrids: [data], gridTitles: [null] });
      });
    });
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
