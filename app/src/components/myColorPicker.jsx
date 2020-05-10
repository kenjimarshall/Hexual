import React, { Component } from "react";
import { CustomPicker } from "react-color";
import "./myColorPicker.css";
import ntc from "./ntc.js";

class MyColorPicker extends Component {
  render() {
    const { Hue } = require("react-color/lib/components/common");
    const { Saturation } = require("react-color/lib/components/common");
    var { EditableInput } = require("react-color/lib/components/common");

    var inputStyles = {
      input: {
        border: "none",
      },
      label: {
        fontSize: "12px",
        color: "#999",
      },
    };

    return (
      <div className="d-flex flex-row">
        <div className="color-picker-holder">
          <div className="saturation-holder">
            <Saturation
              {...this.props}
              onChange={(color) => {
                this.props.onChange(color);
              }}
            />
          </div>
          <div className="hue-holder">
            <Hue
              {...this.props}
              onChange={(color) => {
                this.props.onChange(color);
              }}
              direction={"horizontal"}
            />
          </div>
        </div>
        <div className="d-flex flex-column pl-2 pr-1 text-holder">
          <div className="color-name flex-fill">
            <b>{ntc.name(this.props.hex)[1]}</b>
          </div>
          <EditableInput
            style={inputStyles}
            label="hex"
            value={this.props.hex}
            onChange={(color) => {
              this.props.onChange(color);
            }}
          />
        </div>
      </div>
    );
  }
}

export default CustomPicker(MyColorPicker);
