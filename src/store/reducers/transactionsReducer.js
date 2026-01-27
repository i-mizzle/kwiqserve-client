import { TRANSACTIONS_ERROR, CREATE_TRANSACTION, CREATING_TRANSACTION, DELETE_TRANSACTION, DELETING_TRANSACTION, GET_TRANSACTIONS, GETTING_TRANSACTIONS, UPDATE_TRANSACTION, UPDATING_TRANSACTION } from "../types"

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
        case CREATING_TRANSACTION:
        return {
            ...state,
            creatingTransaction :action.payload,
        }
        case CREATE_TRANSACTION:
        return{
            ...state,
            creatingTransactions:false,
            transactionsError:  null,
            createdTransaction: action.payload,
        }
         case UPDATING_TRANSACTION:
        return {
            ...state,
            updatingTransaction :action.payload,
        }
        case UPDATE_TRANSACTION:
        return{
            ...state,
            updatingTransaction:false,
            transactionsError:  null,
            updatedTransaction: action.payload,
        }
         case DELETING_TRANSACTION:
        return {
            ...state,
            deletingTransaction :action.payload,
        }
        case DELETE_TRANSACTION:
        return{
            ...state,
            deletingTransaction:false,
            transactionsError:  null,
            deletedTransaction: action.payload,
        }
        case TRANSACTIONS_ERROR:
        return{
            ...state,
            loadingTransactions:false,
            creatingTransaction:false,
            updatingTransaction: false,
            deletingTransaction: false,
            transactionsError: action.payload 
        }
        default: return state
    }

}