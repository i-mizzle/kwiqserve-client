import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { CREATE_ORDER, CREATING_ORDER, DELETE_ORDER, DELETING_ORDER, GET_ORDERS, GETTING_ORDERS, SET_SUCCESS, ORDERS_ERROR, UPDATE_ORDER, UPDATING_ORDER } from "../types"

export const fetchOrders = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/orders?expand=table`

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
            type: GETTING_ORDERS,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_ORDERS,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: ORDERS_ERROR,
            error
        })
    }
}

export const createOrder = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/orders`

        dispatch( {
            type: CREATING_ORDER,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })

        dispatch({
            type: CREATE_ORDER,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'New order created successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ORDERS_ERROR,
            error
        })
    }
}

export const clearCreatedOrder = () => async (dispatch) => {
    dispatch({
        type: CREATE_ORDER,
        payload: null
    })
}

export const updateOrder = (id, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/orders/${id}`

        dispatch( {
            type: UPDATING_ORDER,
            payload: true
        })

        const response = await axios.patch(url, payload, { headers })

        dispatch({
            type: UPDATE_ORDER,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Order updated successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ORDERS_ERROR,
            error
        })
    }
}

export const clearUpdatedOrder = () => async (dispatch) => {
    dispatch({
        type: UPDATE_ORDER,
        payload: null
    })
}

export const deleteOrder = (id) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/orders/${id}`

        dispatch( {
            type: DELETING_ORDER,
            payload: true
        })

        const response = await axios.delete(url, { headers })

        dispatch({
            type: DELETE_ORDER,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: 'Order deleted successfully'
        })
        
    }
    catch(error){
        dispatch( {
            type: ORDERS_ERROR,
            error
        })
    }
}

export const clearDeletedOrder = () => async (dispatch) => {
    dispatch({
        type: DELETE_ORDER,
        payload: null
    })
}