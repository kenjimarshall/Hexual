import React, { Component } from "react";
import "./browsePanel.css";

class BrowsePanel extends Component {
  state = {
    genre: "All Genres",
  };

  handleGenreChange = ({ target }) => {
    this.setState({ genre: target.value });
  };

  render() {
    return (
      <div className="col-12 d-flex justify-content-center mb-4">
        <form>
          <div className="d-flex justify-content-center mb-2">
            <div className="col-auto my-1">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => this.props.onBrowse(this.state.genre)}
              >
                Explore
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-5">
            <select
              className="custom-select mr-sm-2"
              id="selectGenre"
              autoComplete="off"
              onChange={this.handleGenreChange}
            >
              <option defaultValue value="All Genres">
                All Genres
              </option>
              <option disabled>──────────</option>
              <option value="rock">Rock</option>
              <option value="indie rock">Indie Rock</option>
              <option value="alternative rock">Alternative Rock</option>
              <option value="art rock">Art Rock</option>
              <option disabled>──────────</option>
              <option value="punk">Punk</option>
              <option value="metal">Metal</option>
              <option value="grunge">Grunge</option>
              <option disabled>──────────</option>
              <option value="reggae">Reggae</option>
              <option value="funk">Funk</option>
              <option value="rap">Hip-Hop</option>
              <option value="trap">Trap</option>
              <option value="pop rap">Pop Rap</option>
              <option value="conscious hip=hop">Conscious Hip-Hop</option>
              <option disabled>──────────</option>
              <option value="r&b">R&B</option>
              <option value="pop">Pop</option>
              <option value="art pop">Art Pop</option>
              <option value="country">Country</option>
              <option value="folk">Folk</option>
              <option disabled>──────────</option>
              <option value="classical">Classical</option>
              <option value="jazz">Jazz</option>
              <option value="blues">Blues</option>
              <option disabled>──────────</option>
              <option value="edm">EDM</option>
              <option value="electro">Electronic</option>
              <option value="house">House</option>
              <option value="techno">Techno</option>
              <option value="dance">Dance</option>
              <option disabled>──────────</option>
              <option value="chillhop">Chillhop</option>
              <option value="lo-fi beats">Lo-Fi</option>
              <option value="ambient">Ambient</option>
            </select>
          </div>
        </form>
      </div>
    );
  }
}

export default BrowsePanel;
