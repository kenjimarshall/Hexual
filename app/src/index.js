import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import $ from "jquery";
// import Popper from "popper.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Album from "./components/album";

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

ReactDOM.render(<Album />, document.getElementById("row"));
registerServiceWorker();
