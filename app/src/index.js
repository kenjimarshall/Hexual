import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import $ from "jquery";
// import Popper from "popper.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

$(".btn").mouseup(function () {
  $(this).blur();
});
