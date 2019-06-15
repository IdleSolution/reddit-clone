import * as action from "./ActionTypes";

export const showPopup = text => dispatch => {
    dispatch({
        type: action.SHOW_POPUP,
        popupText: text
    });

    setTimeout(() => {
        dispatch(removePopup());
    }, 2000);
};

export const removePopup = () => {
    return {
        type: action.REMOVE_POPUP
    };
};
