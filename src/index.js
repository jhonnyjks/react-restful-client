import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import promisse from "redux-promise";
import multi from "redux-multi";
import thunk from "redux-thunk";

import AuthOrApp from "./main/authOrApp";
import reducers from "./main/reducers";
import { initPwa } from "./common/pwa/pwa";

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 });
const store = applyMiddleware(multi, thunk, promisse)(createStore)(
  reducers,
  devTools
);
ReactDOM.render(
  <Provider store={store}>
    <AuthOrApp />
  </Provider>,
  document.getElementById("app")
);

// PWA + Web Push (sw.js em /public). Registro também no Header via PwaControls.
initPwa();
