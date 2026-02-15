import { CART_ERROR, CHECKING_OUT, CHECKOUT, DEDUCTING_FROM_CART, DEDUCT_FROM_CART, FETCHING_CART, FETCH_CART, SENDING_TO_CART, SEND_TO_CART } from "../types"


const initialState = {
    sendingToCart: false,
    deductingFromCart: false,
    fetchingCart: false,
    cart: null,
    cartError: null,
    checkingOut: false,
    order: null
}

export default function(state = initialState, action){

    switch(action.type){
        case SENDING_TO_CART:
        return {
            ...state,
            sendingToCart: action.payload,
        }
        case SEND_TO_CART:
        return {
            ...state,
            sendingToCart: false,
            cart: action.payload
        }
        case DEDUCTING_FROM_CART:
        return {
            ...state,
            deductingFromCart: action.payload,
        }
        case DEDUCT_FROM_CART:
        return {
            ...state,
            deductingFromCart: false,
            cart: action.payload
        }
        case FETCHING_CART:
        return {
            ...state,
            fetchingCart: action.payload,
        }
        case FETCH_CART:
        return{
            ...state,
            fetchingCart:false,
            cart: action.payload,
        }
        case CHECKING_OUT:
        return {
            ...state,
            checkingOut: action.payload,
        }
        case CHECKOUT:
        return{
            ...state,
            checkingOut:false,
            order: action.payload,
            cart: null,
        }
        case CART_ERROR:
        return{
            ...state,
            fetchingCart: false,
            deductingFromCart: false,
            sendingToCart: false,
            checkingOut: false,
            cartError: action.payload 
        }
        default: return state
    }

}