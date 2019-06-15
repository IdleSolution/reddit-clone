import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import thunk from "redux-thunk";
import errorReducer from "./store/reducers/errorReducer";
import popupReducer from "./store/reducers/popupReducer";
import authReducer from "./store/reducers/authReducer";
import loadingReducer from "./store/reducers/loadingReducer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";

const composeEnhancers =
    process.env.NODE_ENV === "development"
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null || compose;
const rootReducer = combineReducers({
    error: errorReducer,
    popup: popupReducer,
    auth: authReducer,
    loading: loadingReducer
});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

serviceWorker.unregister();
