import axios from "axios";
import * as action from "./ActionTypes";
import setAuthToken from "../../utilities/setAuthToken";
import jwt_decode from "jwt-decode";
import { sendError } from "./errors";
import { showPopup } from "./popup";

// REGISTRATION

export const registerUser = (data, history) => dispatch => {
    axios
        .post("/auth/register", data)
        .then(res => {
            history.replace("/");
            dispatch(showPopup("Registration successful!"));
        })
        .catch(err => {
            dispatch(sendError(err.response.data));
        });
};

// LOGIN

export const loginUser = (data, history) => dispatch => {
    axios
        .post("/auth/login", data)
        .then(res => {
            dispatch(showPopup("Logged in successfuly!"));
            const { token } = res.data;
            localStorage.setItem("jwt", token);
            setAuthToken(token);
            const decodedToken = jwt_decode(token);
            dispatch(setCurrentUser(decodedToken));
            history.replace("/");
        })
        .catch(err => {
            console.log(err);

            dispatch(sendError(err.response.data));
        });
};

export const setCurrentUser = decodedToken => {
    return {
        type: action.SET_CURRENT_USER,
        payload: decodedToken
    };
};

// LOGOUT

export const logoutUser = dispatch => {
    localStorage.removeItem("jwt");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({
        type: action.LOGOUT_USER
    });
    dispatch(showPopup("Logged out!"));
};

