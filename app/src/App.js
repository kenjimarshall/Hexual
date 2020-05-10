import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import AlbumGrid from "./components/albumGrid";
import ColorPanel from "./components/colorPanel";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <main className="container">
          <ColorPanel />
          <AlbumGrid />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
