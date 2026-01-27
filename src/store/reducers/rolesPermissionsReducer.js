import { CREATE_ROLE, CREATING_ROLE, GETTING_PERMISSIONS, GETTING_ROLES, GET_PERMISSIONS, GET_ROLES, ROLES_PERMISSIONS_ERROR } from "../types"

const initialState = {
    roles: [],
    loadingRoles: true,
    permissions: [],
    loadingPermissions: true,
    rolesPermissionsError: null,
    creatingRole: false,
    createdRole: null,
    updatingRole: false,
    updatedRole: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_PERMISSIONS:
        return {
            ...state,
            leadingPermissions :action.payload,
        }
        case GET_PERMISSIONS:
        return{
            ...state,
            loadingPermissions:false,
            rolesPermissionsError:  null,
            permissions: action.payload,
        }
        case GETTING_ROLES:
        return {
            ...state,
            loadingRoles :action.payload,
        }
        case GET_ROLES:
        return{
            ...state,
            loadingRoles:false,
            rolesPermissionsError:  null,
            roles: action.payload,
        }
        case CREATING_ROLE:
        return {
            ...state,
            creatingRole :action.payload,
        }
        case CREATE_ROLE:
        return{
            ...state,
            creatingRole:false,
            rolesPermissionsError:  null,
            createdRole: action.payload,
        }
        case ROLES_PERMISSIONS_ERROR:
        return{
            ...state,
            loadingPermissions:false,
            loadingRoles:false,
            rolesPermissionsError: action.payload 
        }
        default: return state
    }

}