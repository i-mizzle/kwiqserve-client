import { MENUS_ERROR, CREATE_MENU, CREATING_MENU, DELETE_MENU, DELETING_MENU, GET_MENUS, GETTING_MENUS, UPDATE_MENU, UPDATING_MENU } from "../types"

const initialState = {
    menus: [],
    loadingMenus: true,
    menusError: null,
    creatingMenu: false,
    createdMenu: null,
    updatingMenu: false,
    updatedMenu: null,
    deletingMenu: false,
    deletedMenu: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_MENUS:
        return {
            ...state,
            loadingMenus :action.payload,
        }
        case GET_MENUS:
        return{
            ...state,
            loadingMenus:false,
            menusError:  null,
            menus: action.payload,
        }
        case CREATING_MENU:
        return {
            ...state,
            creatingMenu :action.payload,
        }
        case CREATE_MENU:
        return{
            ...state,
            creatingMenus:false,
            menusError:  null,
            createdMenu: action.payload,
        }
         case UPDATING_MENU:
        return {
            ...state,
            updatingMenu :action.payload,
        }
        case UPDATE_MENU:
        return{
            ...state,
            updatingMenu:false,
            menusError:  null,
            updatedMenu: action.payload,
        }
         case DELETING_MENU:
        return {
            ...state,
            deletingMenu :action.payload,
        }
        case DELETE_MENU:
        return{
            ...state,
            deletingMenu:false,
            menusError:  null,
            deletedMenu: action.payload,
        }
        case MENUS_ERROR:
        return{
            ...state,
            loadingMenus:false,
            creatingMenu:false,
            updatingMenu: false,
            deletingMenu: false,
            menusError: action.payload 
        }
        default: return state
    }

}