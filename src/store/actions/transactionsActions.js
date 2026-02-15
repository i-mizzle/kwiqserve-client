import axios from "axios"
import { authHeader, baseUrl, businessDetails } from "../../utils"
import { CREATED_TRANSACTION, CREATING_TRANSACTION, GETTING_TRANSACTIONS, GET_TRANSACTIONS, TRANSACTIONS_ERROR } from "../types"

export const createTransaction = (payload) => async (dispatch) => {    
    try{
        const headers = authHeader()
        const store = await businessDetails()

        dispatch({
            type: CREATING_TRANSACTION,
            payload: true
        })

        const response = await axios.post(`${baseUrl}/transactions`, {...payload, ...{store: store._id}}, { headers })
        
        dispatch({
            type: CREATED_TRANSACTION,
            payload: response.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: TRANSACTIONS_ERROR,
            error
        })
    }
}

export const fetchTransactions = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/transactions?expand=createdBy,order,subscriptionPlan`
        if(filterString && filterString !== '') {
            url += `${url.includes('?') ? '&' : '?'}${filterString}`
        }

        if(page && page!=='') {
            url += `${url.includes('?') ? '&' : '?'}page=${page}`
        }

        if(perPage && perPage!=='') {
            url += `${url.includes('?') ? '&' : '?'}perPage=${perPage}`
        }

        dispatch({
            type: GETTING_TRANSACTIONS,
            payload: true
        })

        const response = await axios.get(url, { headers })
        dispatch({
            type: GET_TRANSACTIONS,
            payload: response.data.data
        })
        
    }
    catch(error){
        console.log(error)
        dispatch({
            type: TRANSACTIONS_ERROR,
            error
        })
    }
}

export const clearCreatedTransaction = () => async (dispatch) => { 
    dispatch({
        type: CREATED_TRANSACTION,
        payload: null
    })
}
