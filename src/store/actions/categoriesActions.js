import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_CATEGORY, CREATING_CATEGORY, DELETE_CATEGORY, DELETING_CATEGORY, GET_CATEGORIES, GETTING_CATEGORIES, SET_SUCCESS, CATEGORIES_ERROR, UPDATE_CATEGORY, UPDATING_CATEGORY } from "../types"

const headers = authHeader()

export const fetchCategotys = (filterString, page, perPage) => async (dispatch) => {    
    try{

        let url = `${baseUrl}/categotys?expand=menu`

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
            type: GETTING_CATEGORIES,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_CATEGORIES,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const createCategoty = (payload) => async (dispatch) => {    
    try{

        let url = `${baseUrl}/categotys`

        dispatch( {
            type: CREATING_CATEGORY,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })

        dispatch({
            type: CREATE_CATEGORY,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'New categoty created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearCreatedCategoty = () => async (dispatch) => {
    dispatch({
        type: CREATE_CATEGORY,
        payload: null
    })
}

export const updateCategoty = (id, payload) => async (dispatch) => {    
    try{

        let url = `${baseUrl}/categotys/${id}`

        dispatch( {
            type: UPDATING_CATEGORY,
            payload: true
        })

        const response = await axios.patch(url, payload, { headers })

        dispatch({
            type: UPDATE_CATEGORY,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Categoty updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearUpdatedCategoty = () => async (dispatch) => {
    dispatch({
        type: UPDATE_CATEGORY,
        payload: null
    })
}

export const deleteCategoty = (id) => async (dispatch) => {    
    try{

        let url = `${baseUrl}/categotys/${id}`

        dispatch( {
            type: DELETING_CATEGORY,
            payload: true
        })

        const response = await axios.delete(url, { headers })

        dispatch({
            type: DELETE_CATEGORY,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Categoty deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearDeletedCategoty = () => async (dispatch) => {
    dispatch({
        type: DELETE_CATEGORY,
        payload: null
    })
}