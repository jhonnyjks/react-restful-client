import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import multi from 'redux-multi';
import thunk from 'redux-thunk';

import './index.css';
import AuthOrApp from './main/authOrApp';
import reducers from './main/reducers';

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 });

const store = applyMiddleware(multi, thunk, promise)(createStore)(reducers, devTools);
const mountNode = document.getElementById('root');

if (!mountNode) {
  throw new Error('Elemento raiz #root não encontrado.');
}

ReactDOM.render(
  <Provider store={store}>
    <AuthOrApp />
  </Provider>,
  mountNode,
);
