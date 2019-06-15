import axios from "axios";
import { showPopup } from "./popup";
import { sendError } from "./errors";

export const createPost = (data, history) => dispatch => {
    axios
        .post("/post/new", data)
        .then(post => {
            history.replace(`/r/${data.subreddit}`);
            dispatch(showPopup("Succesfully added new post!"));
        })
        .catch(err => {
            dispatch(sendError(err.response.data));
        });
};
