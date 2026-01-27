import { TABLES_ERROR, CREATE_TABLE, CREATING_TABLE, DELETE_TABLE, DELETING_TABLE, GET_TABLES, GETTING_TABLES, UPDATE_TABLE, UPDATING_TABLE } from "../types"

const initialState = {
    tables: [],
    loadingTables: true,
    tablesError: null,
    creatingTable: false,
    createdTable: null,
    updatingTable: false,
    updatedTable: null,
    deletingTable: false,
    deletedTable: null
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_TABLES:
        return {
            ...state,
            loadingTables :action.payload,
        }
        case GET_TABLES:
        return{
            ...state,
            loadingTables:false,
            tablesError:  null,
            tables: action.payload,
        }
        case CREATING_TABLE:
        return {
            ...state,
            creatingTable :action.payload,
        }
        case CREATE_TABLE:
        return{
            ...state,
            creatingTables:false,
            tablesError:  null,
            createdTable: action.payload,
        }
         case UPDATING_TABLE:
        return {
            ...state,
            updatingTable :action.payload,
        }
        case UPDATE_TABLE:
        return{
            ...state,
            updatingTable:false,
            tablesError:  null,
            updatedTable: action.payload,
        }
         case DELETING_TABLE:
        return {
            ...state,
            deletingTable :action.payload,
        }
        case DELETE_TABLE:
        return{
            ...state,
            deletingTable:false,
            tablesError:  null,
            deletedTable: action.payload,
        }
        case TABLES_ERROR:
        return{
            ...state,
            loadingTables:false,
            creatingTable:false,
            updatingTable: false,
            deletingTable: false,
            tablesError: action.payload 
        }
        default: return state
    }

}