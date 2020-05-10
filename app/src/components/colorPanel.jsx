import React, { Component } from "react";
import ColorPicker from "./colorPicker";
import ntc from "./ntc";
import "./colorPanel.css";

class ColorPanel extends Component {
  starterColor = "#7eabc9";
  starterName = "Glacier";
  nextItemId = 4;

  state = {
    numPickers: 1,
    pickers: [
      {
        id: 0,
        color: this.starterColor,
        name: this.starterName,
      },
      {
        id: 1,
        color: this.starterColor,
        name: this.starterName,
      },
      {
        id: 2,
        color: this.starterColor,
        name: this.starterName,
      },
      {
        id: 3,
        color: this.starterColor,
        name: this.starterName,
      },
    ],
  };

  handleDelete = (id) => {
    if (this.state.pickers.length <= 1) {
      console.log("One or less colors!");
    } else {
      const pickers = this.state.pickers.filter((p) => p.id !== id);
      this.setState({ pickers });
    }
  };

  handleChange = (newColor, picker) => {
    console.log(picker, newColor);
    const pickers = [...this.state.pickers];
    const indexOfChanged = pickers.indexOf(picker);
    pickers[indexOfChanged] = { ...picker };
    pickers[indexOfChanged].color = newColor.hex;
    pickers[indexOfChanged].name = ntc.name(newColor.hex)[1];

    this.setState({ pickers });
  };

  handleCreate = () => {
    if (this.state.pickers.length >= 4) {
      console.log("Already have four!");
    } else {
      const pickers = [...this.state.pickers];
      pickers.push({
        id: this.nextItemId++,
        color: this.starterColor,
        name: this.starterName,
      });
      this.setState({ pickers });
    }
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
        <div className="col-12 d-flex justify-content-center mt-3 panel-buttons">
          <button className="btn btn-light mx-3" onClick={this.handleCreate}>
            Add Tone
          </button>
          <button className="btn btn-primary mx-3">Search!</button>
        </div>
      </div>
    );
  }
}

export default ColorPanel;
