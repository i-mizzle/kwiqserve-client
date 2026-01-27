import { CATEGORIES_ERROR, CREATE_CATEGORY, CREATING_CATEGORY, DELETE_CATEGORY, DELETING_CATEGORY, GET_CATEGORIES, GETTING_CATEGORIES, UPDATE_CATEGORY, UPDATING_CATEGORY } from "../types"

const initialState = {
    categories: [],
    loadingCategories: true,
    categoriesError: null,
    creatingCategory: false,
    createdCategory: null,
    updatingCategory: false,
    updatedCategory: null,
    deletingCategory: false,
    deletedCategory: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_CATEGORIES:
        return {
            ...state,
            loadingCategories :action.payload,
        }
        case GET_CATEGORIES:
        return{
            ...state,
            loadingCategories:false,
            categoriesError:  null,
            categories: action.payload,
        }
        case CREATING_CATEGORY:
        return {
            ...state,
            creatingCategory :action.payload,
        }
        case CREATE_CATEGORY:
        return{
            ...state,
            creatingCategory:false,
            categoriesError:  null,
            createdCategory: action.payload,
        }
         case UPDATING_CATEGORY:
        return {
            ...state,
            updatingCategory :action.payload,
        }
        case UPDATE_CATEGORY:
        return{
            ...state,
            updatingCategory:false,
            categoriesError:  null,
            updatedCategory: action.payload,
        }
         case DELETING_CATEGORY:
        return {
            ...state,
            deletingCategory :action.payload,
        }
        case DELETE_CATEGORY:
        return{
            ...state,
            deletingCategory:false,
            categoriesError:  null,
            deletedCategory: action.payload,
        }
        case CATEGORIES_ERROR:
        return{
            ...state,
            loadingCategories:false,
            creatingCategory:false,
            updatingCategory: false,
            deletingCategory: false,
            categoriesError: action.payload 
        }
        default: return state
    }

}