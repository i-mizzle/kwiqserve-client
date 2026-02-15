import axios from "axios"
import { baseUrl, authHeader } from "../../utils"
import { CREATED_USER, CREATING_USER, DELETED_USER, DELETING_USER, GETTING_USERS,  GETTING_USER_PROFILE, GET_USERS, GET_USER_PROFILE, UPDATED_USER, UPDATING_USER, USER_ERROR } from "../types"

export const createUser = () => async (payload, dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: CREATING_USER,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/auth/create-user`, payload, {headers})
        
        dispatch({
            type: CREATED_USER,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}

export const getLoggedInUserProfile = () => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: GETTING_USER_PROFILE,
            payload: true
        })

        const response = await axios.get(`${baseUrl}/user/profile`, { headers })
        dispatch({
            type: GET_USER_PROFILE,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}

export const getUserDetails = (userId) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: GETTING_USER_PROFILE,
            payload: true
        })

        const response = await axios.get(`${baseUrl}/users/profile/${userId}`, { headers })
        
        dispatch({
            type: GET_USER_PROFILE,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}

export const fetchUsers = (
    // paginationString, searchTerm
) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: GETTING_USERS,
            payload: true
        })

        const response = await axios.get(`${baseUrl}/users/all`, { headers })
        dispatch({
            type: GET_USERS,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}


export const updateUserProfile = (userId, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: UPDATING_USER,
            payload: true
        })

        const response = await axios.patch(`${baseUrl}/user/profile/${userId}`, payload, { headers })
        
        dispatch({
            type: UPDATED_USER,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}

export const deleteUser = (userId) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: DELETING_USER,
            payload: true
        })

        const response = await axios.delete(`${baseUrl}/users/delete/${userId}`, { headers })
        
        dispatch({
            type: DELETED_USER,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}

export const resetUserPassword = (userId) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: UPDATING_USER,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/reset-password/${userId}`, {}, { headers })
        
        dispatch({
            type: UPDATED_USER,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: USER_ERROR,
            error
        })
    }
}