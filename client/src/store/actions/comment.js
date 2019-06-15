import axios from "axios";
import { sendError } from "./errors";

export const createComment = data => dispatch => {
    axios
        .post("/comment/new", data)
        .then(data => {
            window.location.reload();
        })
        .catch(e => {
            dispatch(sendError(e.response.data));
        });
};
