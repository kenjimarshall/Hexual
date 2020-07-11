import React, { Component } from "react";
import ColorPicker from "./colorPicker";
import ntc from "./ntc";
import "./colorPanel.css";
import $ from "jquery";

class ColorPanel extends Component {
  starterColor = "#005b96";
  starterName = "Bahama Blue";
  nextItemId = 1;

  state = {
    numPickers: 1,
    pickers: [
      {
        id: 0,
        color: this.starterColor,
        name: this.starterName,
      },
    ],
    genre: "All Genres",
  };

  handleGenreChange = ({ target }) => {
    this.setState({ genre: target.value });
  };

  handleDelete = (id) => {
    if (this.state.numPickers <= 1) {
    } else {
      const pickers = this.state.pickers.filter((p) => p.id !== id);
      const numPickers = this.state.numPickers - 1;
      this.setState({ pickers, numPickers });
    }
  };

  handleChange = (newColor, picker) => {
    const pickers = [...this.state.pickers];
    const indexOfChanged = pickers.indexOf(picker);
    pickers[indexOfChanged] = { ...picker };
    pickers[indexOfChanged].color = newColor.hex;
    pickers[indexOfChanged].name = ntc.name(newColor.hex)[1];

    this.setState({ pickers });
  };

  handleCreate = () => {
    if (this.state.numPickers >= 4) {
    } else {
      const pickers = [...this.state.pickers];
      pickers.push({
        id: this.nextItemId++,
        color: this.starterColor,
        name: this.starterName,
      });
      const numPickers = this.state.numPickers + 1;
      this.setState({ pickers, numPickers });
    }
  };

  handleImageUpload = ({ target }) => {
    const image = target.files[0];
    fetch("/api/image", {
      method: "POST",
      body: image,
    }).then((res) => {
      res.json().then((data) => {
        const colors = data["data"];
        const pickers = [];
        for (let i = 0; i < 4; i++) {
          pickers.push({
            id: this.nextItemId++,
            color: colors[i],
            name: ntc.name(colors[i])[1],
          });
        }
        this.setState({ pickers, numPickers: 4 });
      });
    });
  };

  render() {
    return (
      <div className="row d-flex justify-content-center mb-5">
        {this.state.pickers.map((picker) => (
          <ColorPicker
            key={picker.id}
            picker={picker}
            onDelete={this.handleDelete}
            onChange={this.handleChange}
          ></ColorPicker>
        ))}
        <div className="col-12 mt-3 d-flex palette-selection px-0">
          {this.state.pickers.map((picker) => (
            <div
              key={picker.id}
              className="flex-fill h-100"
              style={{ background: picker.color }}
            ></div>
          ))}
        </div>
        <div className="col-12 d-flex justify-content-center mt-3">
          <form>
            <div className="form-group text-center">
              <button
                className="btn btn-outline-secondary mb-2 mx-2"
                type="button"
                onClick={this.handleCreate}
              >
                Add Colour
              </button>
              <div className="custom-file mt-2 mx-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple={false}
                  className="custom-file-input"
                  id="custom-file"
                  onChange={(obj) => this.handleImageUpload(obj)}
                ></input>
                <label
                  className="custom-file-label text-left"
                  htmlFor="custom-file"
                >
                  Choose file
                </label>
              </div>
            </div>
            <div className="input-group">
              <select
                className="custom-select mx-2"
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
              <button
                className="btn btn-primary mx-2"
                type="button"
                onClick={() =>
                  this.props.onPaletteSearch(
                    this.state.pickers,
                    this.state.genre
                  )
                }
              >
                Search!
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

$(function () {
  $("#file").on("click touchstart", function () {
    $(this).val("");
  });
});

export default ColorPanel;
