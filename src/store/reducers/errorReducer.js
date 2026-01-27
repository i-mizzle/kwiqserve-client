import { CLEAR_ERROR } from "../types";

const initialState = {
    error: null
};
   
export function errorReducer(state = initialState, action){
    const { error } = action;

    if(error){
        return {
            error: error.response.data
        }
    }

    else if(action.type === CLEAR_ERROR){
        return {
            error: null,
        }
    }

    return state;
}