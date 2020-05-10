import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import AlbumGrid from "./components/albumGrid";
import SearchPanel from "./components/searchPanel";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <main className="container">
          <AlbumGrid />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
