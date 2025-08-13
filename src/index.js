import React from "react";
import { createRoot } from "react-dom/client";
import "assets/css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
 // <React.StrictMode>
    <App />
  //</React.StrictMode>
);

reportWebVitals();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals