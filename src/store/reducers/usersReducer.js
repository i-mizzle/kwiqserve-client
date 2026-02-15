import { CREATED_USER, CREATING_USER, DELETED_USER, DELETING_USER, GETTING_USERS, GETTING_USER_PROFILE, GET_USERS, GET_USER_PROFILE, UPDATED_USER, UPDATING_USER, USER_ERROR } from "../types"

const initialState = {
    creatingUser: false,
    createdUser: null,
    updatingUser: false,
    updatedUser: null,
    deletingUser: false,
    deletedUser: null,
    loadingUserProfile: true,
    userProfile: null,
    currentUser: null,
    userError: null,
    loadingUsers: false,
    users: [],
}

export default function(state = initialState, action){

    switch(action.type){
        case CREATING_USER:
        return {
            ...state,
            creatingUser:action.payload,
            // fetchingMembers:false
        }
        case CREATED_USER:
        return{
            ...state,
            creatingUser:false,
            userError: null,
            createdUser: action.payload,
        }
        case DELETING_USER:
        return {
            ...state,
            deletingUser:action.payload,
            // fetchingMembers:false
        }
        case DELETED_USER:
        return{
            ...state,
            deletingUser:false,
            userError: null,
            deletedUser: action.payload,
        }
        case UPDATING_USER:
        return {
            ...state,
            updatingUser:action.payload,
            // fetchingMembers:false
        }
        case UPDATED_USER:
        return{
            ...state,
            updatingUser:false,
            userError: null,
            updatedUser: action.payload,
        }
        case GETTING_USERS:
        return {
            ...state,
            loadingUsers: action.payload,
            // fetchingMembers:false
        }
        case GET_USERS:
        return{
            ...state,
            loadingUsers: false,
            userError: null,
            users: action.payload,
        }
        case GETTING_USER_PROFILE:
        return {
            ...state,
            loadingUserProfile: action.payload,
            // fetchingMembers:false
        }
        case GET_USER_PROFILE:
        return{
            ...state,
            loadingUserProfile: false,
            userError: null,
            currentUser: action.payload,
        }
        case USER_ERROR:
        return{
            ...state,
            updatingUser: false,
            loadingUsers: false,
            loadingUserProfile: false,
            deletingUser: false,
            creatingUser: false,
            userError: action.payload 
        }
        default: return state
    }

}