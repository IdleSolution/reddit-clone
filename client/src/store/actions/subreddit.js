import axios from "axios";
import { showPopup } from "./popup";
import { sendError } from "./errors";

export const createSubreddit = (data, history) => dispatch => {
    axios
        .post("/r/new", data)
        .then(data => {
            history.replace("/");
            dispatch(showPopup("Subreddit created!"));
        })
        .catch(err => {
            dispatch(sendError(err.response.data));
        });
};
