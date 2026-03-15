import axios from "axios"
import { authHeader, baseUrl, businessDetails, clientId} from "../../utils"
import { CART_ERROR, CHECKING_OUT, CHECKOUT, FETCHING_CART, FETCH_CART, SENDING_TO_CART, SEND_TO_CART, SET_SUCCESS } from "../types"

const resolveBusinessId = (businessOrId) => {
    if (!businessOrId) {
        return null
    }

    if (typeof businessOrId === 'string') {
        return businessOrId
    }

    return businessOrId?._id || businessOrId?.id || null
}

export const sendToCart = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const businessId = resolveBusinessId(payload?.business) || resolveBusinessId(businessDetails())

        if (!businessId) {
            throw new Error('Business ID not available for cart operations')
        }

        dispatch({
            type: SENDING_TO_CART,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/shopping-carts/add/${businessId}`, 
            {
                ...payload, 
                ...{business: businessId}
            }, { headers })
        
        dispatch({
            type: SEND_TO_CART,
            payload: response.data.data
        })

        dispatch({
            type: SET_SUCCESS,
            payload: "Item added to your order"
        })
        
        return { success: true }
    }
    catch(error){
        console.log('send to cart error: ', error)
        dispatch({
            type: CART_ERROR,
            payload: error
        })
        return { success: false, error }
    }
}

export const deductFromCart = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const businessId = resolveBusinessId(payload?.business) || resolveBusinessId(businessDetails())

        if (!businessId) {
            throw new Error('Business ID not available for cart operations')
        }

        dispatch({
            type: SENDING_TO_CART,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/shopping-carts/deduct/${businessId}`, {...payload, ...{business: businessId}}, { headers })
        
        dispatch({
            type: SEND_TO_CART,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log('deduction error: ', error)
        dispatch({
            type: CART_ERROR,
            payload: error
        })
    }
}

export const fetchCart = (filterString) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const client = clientId()
        const businessId = resolveBusinessId(businessDetails())

        if (!businessId) {
            throw new Error('Business ID not available for cart fetch')
        }

        let url = `${baseUrl}/shopping-carts/${businessId}/${client}?expand=items.item,items.parentItem,items.parentItemCategory&checkoutStatus=pending`
        if(filterString && filterString !== '') {
            url += `${url.includes('?') ? '&' : '?'}${filterString}`
        }

        dispatch({
            type: FETCHING_CART,
            payload: true
        })

        const response = await axios.get(url, { headers })
        console.log('cart in actions: ', response.data)
        dispatch({
            type: FETCH_CART,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log('fetch cart error: ', error)
        if(error?.response?.data?.errorCode !== 'not-found'){
            dispatch({
                type: CART_ERROR,
                payload: error
            })
        } else {
            dispatch({
                type: FETCH_CART,
                payload: null
            })
        }
    }
}

export const checkoutCart = (cartId, payload) => async (dispatch) => {    
    try{
        const headers = authHeader()
        // const client = clientId()

        let url = `${baseUrl}/shopping-carts/${cartId}/checkout`

        dispatch({
            type: CHECKING_OUT,
            payload: true
        })

        const response = await axios.post(url, payload, { headers })
        
        dispatch({
            type: CHECKOUT,
            payload: response.data.data.order
        })
        
    }
    catch(error){
        console.log('fetch cart error: ', error)
        if(error?.response?.data?.errorCode !== 'not-found'){
            dispatch({
                type: CART_ERROR,
                payload: error
            })
        } else {
            dispatch({
                type: FETCH_CART,
                payload: null
            })
        }
    }
}


// export const deleteCategory = (categoryId) => async (dispatch) => {    
//     try{
//         const headers = authHeader()

//         dispatch({
//             type: DELETING_CATEGORY,
//             payload: true
//         })
//         console.log('deleting category in actions...')

//         const response = await axios.delete(`${baseUrl}/categories/${categoryId}`, { headers })
        
//         dispatch({
//             type: DELETED_CATEGORY,
//             payload: response.data.data
//         })
        
//     }
//     catch(error){
//         console.log(error)
//         dispatch({
//             type: CATEGORIES_ERROR,
//             error
//         })
//     }
// }

export const clearCheckedOut = () => async (dispatch) => { 
    dispatch({
        type: CHECKOUT,
        payload: null
    })
}

// export const clearDeletedCategory = () => async (dispatch) => { 
//     dispatch({
//         type: DELETED_CATEGORY,
//         payload: null
//     })
// }