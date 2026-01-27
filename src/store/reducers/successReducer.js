import { CLEAR_SUCCESS, SET_SUCCESS } from "../types";

const initialState = {
    successMessage: null,
};
  
const successReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SUCCESS:
        return { 
            successMessage: action.payload 
        };
        case CLEAR_SUCCESS:
        return { 
            successMessage: null 
        };
        default:
        return state;
    }
};
  
export default successReducer;