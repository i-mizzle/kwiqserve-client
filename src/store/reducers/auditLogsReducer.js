import { AUDIT_LOGS_ERROR, GETTING_AUDIT_LOGS, GET_AUDIT_LOGS } from "../types"


const initialState = {
    auditLogs: [],
    loadingAuditLogs: true,
    auditLogsError: null,
}

export default function(state = initialState, action){

    switch(action.type){
        case GETTING_AUDIT_LOGS:
        return {
            ...state,
            loadingAuditLogs :action.payload,
        }
        case GET_AUDIT_LOGS:
        return{
            ...state,
            loadingAuditLogs:false,
            auditLogsError:  null,
            auditLogs: action.payload,
        }
        case AUDIT_LOGS_ERROR:
        return{
            ...state,
            loadingAuditLogs:false,
            auditLogsError: action.payload 
        }
        default: return state
    }

}