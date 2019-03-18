import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
// Contracts
import ScholarshipManager from "../../build/contracts/ScholarshipManager.json"
import Scholarship from "../../build/contracts/Scholarship.json"

const drizzleOptions = {
  contracts: [
    ScholarshipManager
  ]
}
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const connectedApp = (
  <DrizzleContext.Provider drizzle={drizzle}>
    <App />
  </DrizzleContext.Provider>
);

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render(connectedApp, document.getElementById("root"));
});
