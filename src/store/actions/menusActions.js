import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_MENU, CREATING_MENU, DELETE_MENU, DELETING_MENU, GET_MENUS, GETTING_MENUS, SET_SUCCESS, MENUS_ERROR, UPDATE_MENU, UPDATING_MENU } from "../types"

export const fetchMenus = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/menus`

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
            type: GETTING_MENUS,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_MENUS,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: MENUS_ERROR,
            error
        })
    }
}

export const createMenu = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/menus`

        dispatch( {
            type: CREATING_MENU,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })

        dispatch({
            type: CREATE_MENU,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'New menu created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: MENUS_ERROR,
            error
        })
    }
}

export const clearCreatedMenu = () => async (dispatch) => {
    dispatch({
        type: CREATE_MENU,
        payload: null
    })
}

export const updateMenu = (id, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/menus/${id}`

        dispatch( {
            type: UPDATING_MENU,
            payload: true
        })

        const response = await axios.patch(url, payload, { headers })

        dispatch({
            type: UPDATE_MENU,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Menu updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: MENUS_ERROR,
            error
        })
    }
}

export const clearUpdatedMenu = () => async (dispatch) => {
    dispatch({
        type: UPDATE_MENU,
        payload: null
    })
}

export const deleteMenu = (id) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/tables/${id}`

        dispatch( {
            type: DELETING_MENU,
            payload: true
        })

        const response = await axios.delete(url, { headers })

        dispatch({
            type: DELETE_MENU,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Menu deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: MENUS_ERROR,
            error
        })
    }
}

export const clearDeletedMenu = () => async (dispatch) => {
    dispatch({
        type: DELETE_MENU,
        payload: null
    })
}