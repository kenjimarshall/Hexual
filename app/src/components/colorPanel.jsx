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
          <div className="form-group text-center align-items-center">
            <button
              className="btn btn-light mx-3 mb-2"
              onClick={this.handleCreate}
            >
              Add Tone
            </button>
            <button
              className="btn btn-primary mx-3 mb-2"
              onClick={() => this.props.onPaletteSearch(this.state.pickers)}
            >
              Search!
            </button>
            <div className="custom-file mt-2">
              <input
                type="file"
                accept="image/*"
                id="file"
                multiple={false}
                className="custom-file-input"
                id="customFile"
                onChange={(obj) => this.handleImageUpload(obj)}
              ></input>
              <label
                className="custom-file-label text-left"
                htmlFor="customFile"
              >
                Choose file
              </label>
            </div>
          </div>
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
