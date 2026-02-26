import { CLEAR_NOTIFICATION, SET_NOTIFICATION } from "../types";

const initialState = {
    notificationMessage: null,
};
  
const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATION:
        return { 
            notificationMessage: action.payload 
        };
        case CLEAR_NOTIFICATION:
        return { 
            notificationMessage: null 
        };
        default:
        return state;
    }
};
  
export default notificationReducer;