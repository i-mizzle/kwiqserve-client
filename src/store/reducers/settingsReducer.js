import { FETCHING_SETTINGS, FETCH_SETTINGS, SETTINGS_ERROR, UPDATED_SETTINGS, UPDATING_SETTINGS } from "../types"

const initialState = {
    updatingSettings: false,
    updatedSettings: null,
    settingsError: null,
    fetchingSettings: false,
    settings: null,
}

export default function(state = initialState, action){

    switch(action.type){
        case UPDATING_SETTINGS:
        return {
            ...state,
            updatingSettings: action.payload,
            // fetchingMembers:false
        }
        case UPDATED_SETTINGS:
        return{
            ...state,
            updatingSettings:false,
            settingsError: null,
            updatedSettings: action.payload,
        }
        case FETCHING_SETTINGS:
        return {
            ...state,
            fetchingSettings: action.payload,
            // fetchingMembers:false
        }
        case FETCH_SETTINGS:
        return{
            ...state,
            fetchingSettings:false,
            settings: action.payload,
        }
        case SETTINGS_ERROR:
        return{
            ...state,
            updatingSettings: false,
            fetchingSettings: false,
            settingsError: action.payload 
        }
        default: return state
    }

}