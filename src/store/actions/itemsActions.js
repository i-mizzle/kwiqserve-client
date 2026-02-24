import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_ITEM, CREATING_ITEM, DELETE_ITEM, DELETING_ITEM, GET_ITEMS, GETTING_ITEMS, SET_SUCCESS, ITEMS_ERROR, UPDATE_ITEM, UPDATING_ITEM } from "../types"

export const fetchItems = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/items?expand=category,variants`

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
            type: GETTING_ITEMS,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_ITEMS,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: ITEMS_ERROR,
            error
        })
    }
}

export const createItem = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/items`

        dispatch( {
            type: CREATING_ITEM,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })

        dispatch({
            type: CREATE_ITEM,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'New item created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ITEMS_ERROR,
            error
        })
    }
}

export const clearCreatedItem = () => async (dispatch) => {
    dispatch({
        type: CREATE_ITEM,
        payload: null
    })
}

export const updateItem = (id, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/items/${id}`

        dispatch( {
            type: UPDATING_ITEM,
            payload: true
        })

        const response = await axios.patch(url, payload, { headers })

        dispatch({
            type: UPDATE_ITEM,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Item updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ITEMS_ERROR,
            error
        })
    }
}

export const clearUpdatedItem = () => async (dispatch) => {
    dispatch({
        type: UPDATE_ITEM,
        payload: null
    })
}

export const deleteItem = (id) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/items/${id}`

        dispatch( {
            type: DELETING_ITEM,
            payload: true
        })

        const response = await axios.delete(url, { headers })

        dispatch({
            type: DELETE_ITEM,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Item deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ITEMS_ERROR,
            error
        })
    }
}

export const clearDeletedItem = () => async (dispatch) => {
    dispatch({
        type: DELETE_ITEM,
        payload: null
    })
}