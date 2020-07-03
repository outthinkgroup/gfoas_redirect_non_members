import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

function load() {
  if (document.getElementById("redirect-settings-root")) {
    ReactDOM.render(<App />, document.getElementById("redirect-settings-root"));
  }
}
window.addEventListener("load", load);
