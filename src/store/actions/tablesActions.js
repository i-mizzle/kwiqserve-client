import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_TABLE, CREATING_TABLE, DELETE_TABLE, DELETING_TABLE, GET_TABLES, GETTING_TABLES, SET_SUCCESS, TABLES_ERROR, UPDATE_TABLE, UPDATING_TABLE } from "../types"

export const fetchTables = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/tables?expand=menu`

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
            type: GETTING_TABLES,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_TABLES,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: TABLES_ERROR,
            error
        })
    }
}

export const createTable = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/tables`

        dispatch( {
            type: CREATING_TABLE,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })

        dispatch({
            type: CREATE_TABLE,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'New table created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: TABLES_ERROR,
            error
        })
    }
}

export const clearCreatedTable = () => async (dispatch) => {
    dispatch({
        type: CREATE_TABLE,
        payload: null
    })
}

export const updateTable = (id, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/tables/${id}`

        dispatch( {
            type: UPDATING_TABLE,
            payload: true
        })

        const response = await axios.patch(url, payload, { headers })

        dispatch({
            type: UPDATE_TABLE,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Table updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: TABLES_ERROR,
            error
        })
    }
}

export const clearUpdatedTable = () => async (dispatch) => {
    dispatch({
        type: UPDATE_TABLE,
        payload: null
    })
}

export const deleteTable = (id) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/tables/${id}`

        dispatch( {
            type: DELETING_TABLE,
            payload: true
        })

        const response = await axios.delete(url, { headers })

        dispatch({
            type: DELETE_TABLE,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Table deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: TABLES_ERROR,
            error
        })
    }
}

export const clearDeletedTable = () => async (dispatch) => {
    dispatch({
        type: DELETE_TABLE,
        payload: null
    })
}