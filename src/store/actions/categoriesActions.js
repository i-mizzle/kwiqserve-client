import axios from "axios"
import { authHeader, baseUrl, businessDetails } from "../../utils"
import { CREATE_CATEGORY, CREATING_CATEGORY, DELETE_CATEGORY, DELETING_CATEGORY, GET_CATEGORIES, GETTING_CATEGORIES, SET_SUCCESS, CATEGORIES_ERROR, UPDATE_CATEGORY, UPDATING_CATEGORY } from "../types"

export const fetchCategories = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const business = businessDetails()

        let url = `${baseUrl}/categories/${business._id}`

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
        // console.log('categories fetched => ', response.data.data)

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

export const createCategory = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/categories`

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
            payload: 'New categories created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearCreatedCategory = () => async (dispatch) => {
    dispatch({
        type: CREATE_CATEGORY,
        payload: null
    })
}

export const updateCategory = (id, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/categories/${id}`

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
            payload: 'Category updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearUpdatedCategories = () => async (dispatch) => {
    dispatch({
        type: UPDATE_CATEGORY,
        payload: null
    })
}

export const deleteCategories = (id) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/categories/${id}`

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
            payload: 'Category deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: CATEGORIES_ERROR,
            error
        })
    }
}

export const clearDeletedCategory = () => async (dispatch) => {
    dispatch({
        type: DELETE_CATEGORY,
        payload: null
    })
}