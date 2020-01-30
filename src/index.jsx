import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { SoundQueue } from "./components/SoundQueue/SoundQueue";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { App } from "./components/App/App";
import api from "./utils/api";
import "./i18n";

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument({ api })))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
    <SoundQueue />
  </Provider>,
  document.getElementById("app")
);
