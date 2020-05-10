import React, { Component } from "react";
import "./colorPicker.css";
import MyColorPicker from "./myColorPicker";

class ColorPicker extends Component {
  state = {
    displayColorPicker: false,
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-12 col-sm-6 col-lg-3 d-flex flex-column align-items-center px-0">
          <button
            className="btn btn-light"
            onClick={() => this.props.onDelete(this.props.picker.id)}
          >
            X
          </button>
          <h3 className="display-5">{this.props.picker.name}</h3>
          <div
            className="color-display"
            style={{
              background: this.props.picker.color,
            }}
            onClick={this.handleClick}
          ></div>
          {this.state.displayColorPicker ? (
            <div className="popup">
              <div className="cover" onClick={this.handleClose} />
              <MyColorPicker
                color={this.props.picker.color}
                onChange={(color) =>
                  this.props.onChange(color, this.props.picker)
                }
              ></MyColorPicker>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default ColorPicker;
