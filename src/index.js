import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import promisse from "redux-promise";
import multi from "redux-multi";
import thunk from "redux-thunk";

import * as serviceWorker from "./serviceWorker";
import AuthOrApp from "./main/authOrApp";
import reducers from "./main/reducers";

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
