import * as actions from "./../actions/ActionTypes";

const initialState = {
    showRegistrationPopup: false,
    popupText: ""
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SHOW_POPUP:
            return {
                ...state,
                showPopup: true,
                popupText: action.popupText
            };
        case actions.REMOVE_POPUP:
            return {
                ...state,
                showPopup: false
            };
        default:
            return {
                ...state
            };
    }
};

export default reducer;
