import * as action from "./ActionTypes";

export const sendError = error => {
    return {
        type: action.SHOW_ERROR,
        payload: error
    };
};

export const clearErrors = () => {
    return {
        type: action.CLEAR_ERRORS
    };
};
