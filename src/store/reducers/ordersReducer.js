import { ORDERS_ERROR, CREATE_ORDER, CREATING_ORDER, DELETE_ORDER, DELETING_ORDER, GET_ORDERS, GETTING_ORDERS, UPDATE_ORDER, UPDATING_ORDER } from "../types"

const initialState = {
    orders: [],
    loadingOrders: true,
    ordersError: null,
    creatingOrder: false,
    createdOrder: null,
    updatingOrder: false,
    updatedOrder: null,
    deletingOrder: false,
    deletedOrder: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_ORDERS:
        return {
            ...state,
            loadingOrders :action.payload,
        }
        case GET_ORDERS:
        return{
            ...state,
            loadingOrders:false,
            ordersError:  null,
            orders: action.payload,
        }
        case CREATING_ORDER:
        return {
            ...state,
            creatingOrder :action.payload,
        }
        case CREATE_ORDER:
        return{
            ...state,
            creatingOrders:false,
            ordersError:  null,
            createdOrder: action.payload,
        }
         case UPDATING_ORDER:
        return {
            ...state,
            updatingOrder :action.payload,
        }
        case UPDATE_ORDER:
        return{
            ...state,
            updatingOrder:false,
            ordersError:  null,
            updatedOrder: action.payload,
        }
         case DELETING_ORDER:
        return {
            ...state,
            deletingOrder :action.payload,
        }
        case DELETE_ORDER:
        return{
            ...state,
            deletingOrder:false,
            ordersError:  null,
            deletedOrder: action.payload,
        }
        case ORDERS_ERROR:
        return{
            ...state,
            loadingOrders:false,
            creatingOrder:false,
            updatingOrder: false,
            deletingOrder: false,
            ordersError: action.payload 
        }
        default: return state
    }

}