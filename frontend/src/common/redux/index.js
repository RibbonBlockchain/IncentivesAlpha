import { compose, createStore, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import reducer from "./reducers";

export const history = createBrowserHistory({
  basename: process.env.NODE_ENV === "localhost" ? "/" : "/"
});

const composeWithDevTools =
  /* eslint-disable-next-line no-underscore-dangle */
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = createStore(
  reducer(history),
  {},
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
);

export default configureStore;
