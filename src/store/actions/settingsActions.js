import axios from "axios"
import { authHeader, baseUrl, businessDetails } from "../../utils"
import { FETCHING_SETTINGS, FETCH_SETTINGS, SETTINGS_ERROR, UPDATED_SETTINGS, UPDATING_SETTINGS } from "../types"


export const updateSettings = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const store = await businessDetails()

        dispatch({
            type: UPDATING_SETTINGS,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/settings`, {...payload, ...{store: store._id}}, { headers })
        
        dispatch({
            type: UPDATED_SETTINGS,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: SETTINGS_ERROR,
            error
        })
    }
}

export const fetchStoreSettings = () => async (dispatch) => {    
    try{
        const headers = {
            "x-original-host": window && window.location.host
        }

        dispatch({
            type: FETCHING_SETTINGS,
            payload: true
        })

        const response = await axios.get(`${baseUrl}/settings?expand=receivingAccounts.account`, { headers })
        
        dispatch({
            type: FETCH_SETTINGS,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: SETTINGS_ERROR,
            error
        })
    }
}

export const clearUpdatedSettings = () => async (dispatch) => { 
    dispatch({
        type: UPDATED_SETTINGS,
        payload: null
    })
}