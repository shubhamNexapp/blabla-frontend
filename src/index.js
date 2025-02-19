import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store from "./store";
import InactivityHandler from "./common/inactivityHandler";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter>
        <InactivityHandler>
          <App />
        </InactivityHandler>
        <ToastContainer />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
