import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import $ from "jquery";
// import Popper from "popper.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AlbumGrid from "./components/albumGrid";

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

ReactDOM.render(<AlbumGrid />, document.getElementById("container"));
registerServiceWorker();
