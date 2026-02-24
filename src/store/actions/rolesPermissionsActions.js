import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_ROLE, CREATING_ROLE, GETTING_PERMISSIONS, GETTING_ROLES, GET_PERMISSIONS, GET_ROLES, ROLES_PERMISSIONS_ERROR, SET_SUCCESS, UPDATE_ROLE, UPDATING_ROLE } from "../types"

export const fetchPermissions = () => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/permissions`


        dispatch( {
            type: GETTING_PERMISSIONS,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_PERMISSIONS,
            payload: response.data.data.permissions
        })
        
    }
    catch(error){
        dispatch( {
            type: ROLES_PERMISSIONS_ERROR,
            error
        })
    }
}

export const createRole = (rolePayload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: CREATING_ROLE,
            payload: true
        })
        const response = await axios.post(`${baseUrl}/roles`, rolePayload, { headers })
        
        dispatch({
            type: CREATE_ROLE,
            payload: response.data.data
        })

        dispatch({
            type:SET_SUCCESS,
            payload: "New role created successfully"
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: ROLES_PERMISSIONS_ERROR,
            error
        })
    }
}

export const updateRole = (roleId, rolePayload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        dispatch({
            type: UPDATING_ROLE,
            payload: true
        })
        const response = await axios.patch(`${baseUrl}/roles/roleId`, rolePayload, { headers })
        
        dispatch({
            type: UPDATE_ROLE,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: ROLES_PERMISSIONS_ERROR,
            error
        })
    }
}

export const fetchRoles = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/roles?expand=createdBy`
        if(filterString && filterString !== '') {
            url += `${url.includes('?') ? '&' : '?'}${filterString}`
        }

        if(page && page!=='') {
            url += `${url.includes('?') ? '&' : '?'}page=${page}`
        }

        if(perPage && perPage!=='') {
            url += `${url.includes('?') ? '&' : '?'}perPage=${perPage}`
        }

        dispatch( {
            type: GETTING_ROLES,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_ROLES,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: ROLES_PERMISSIONS_ERROR,
            error
        })
    }
}

export const clearCreatedRole = () => async (dispatch) => {    
    dispatch({
        type: CREATE_ROLE,
        payload: null
    })
}

export const clearUpdatedRole = () => async (dispatch) => {    
    dispatch({
        type: UPDATE_ROLE,
        payload: null
    })
}
