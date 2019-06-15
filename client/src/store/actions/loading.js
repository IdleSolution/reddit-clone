import * as action from "./ActionTypes";

export const startLoading = () => {
    return {
        type: action.START_LOADING
    }
}

export const stopLoading = () => {
    return {
        type: action.STOP_LOADING
    }
}