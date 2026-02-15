import { ITEMS_ERROR, CREATE_ITEM, CREATING_ITEM, DELETE_ITEM, DELETING_ITEM, GET_ITEMS, GETTING_ITEMS, UPDATE_ITEM, UPDATING_ITEM } from "../types"

const initialState = {
    items: [],
    loadingItems: true,
    itemsError: null,
    creatingItem: false,
    createdItem: null,
    updatingItem: false,
    updatedItem: null,
    deletingItem: false,
    deletedItem: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_ITEMS:
        return {
            ...state,
            loadingItems :action.payload,
        }
        case GET_ITEMS:
        return{
            ...state,
            loadingItems:false,
            itemsError:  null,
            items: action.payload,
        }
        case CREATING_ITEM:
        return {
            ...state,
            creatingItem :action.payload,
        }
        case CREATE_ITEM:
        return{
            ...state,
            creatingItem: false,
            itemsError: null,
            createdItem: action.payload,
        }
         case UPDATING_ITEM:
        return {
            ...state,
            updatingItem :action.payload,
        }
        case UPDATE_ITEM:
        return{
            ...state,
            updatingItem:false,
            itemsError:  null,
            updatedItem: action.payload,
        }
         case DELETING_ITEM:
        return {
            ...state,
            deletingItem :action.payload,
        }
        case DELETE_ITEM:
        return{
            ...state,
            deletingItem:false,
            itemsError:  null,
            deletedItem: action.payload,
        }
        case ITEMS_ERROR:
        return{
            ...state,
            loadingItems:false,
            creatingItem:false,
            updatingItem: false,
            deletingItem: false,
            itemsError: action.payload 
        }
        default: return state
    }

}