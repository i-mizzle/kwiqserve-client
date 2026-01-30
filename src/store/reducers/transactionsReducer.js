import { TRANSACTIONS_ERROR, GET_TRANSACTIONS, GETTING_TRANSACTIONS } from "../types"

const initialState = {
    transactions: [],
    loadingTransactions: true,
    transactionsError: null,
    creatingTransaction: false,
    createdTransaction: null,
    updatingTransaction: false,
    updatedTransaction: null,
    deletingTransaction: false,
    deletedTransaction: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_TRANSACTIONS:
        return {
            ...state,
            loadingTransactions :action.payload,
        }
        case GET_TRANSACTIONS:
        return{
            ...state,
            loadingTransactions:false,
            transactionsError:  null,
            transactions: action.payload,
        }
        case TRANSACTIONS_ERROR:
        return{
            ...state,
            loadingTransactions:false,
            transactionsError: action.payload 
        }
        default: return state
    }

}