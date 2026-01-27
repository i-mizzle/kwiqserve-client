import axios from "axios"
import { authHeader, baseUrl } from "../../utils"
import { AUDIT_LOGS_ERROR, GETTING_AUDIT_LOGS, GET_AUDIT_LOGS } from "../types"

export const fetchAuditLogs = (filterString, page, perPage) => async (dispatch) => {    
    try{
        const headers = authHeader()

        let url = `${baseUrl}/audit-logs?expand=actor`

        if(filterString && filterString !== '') {
            url += `${url.includes('?') ? '&' : '?'}${filterString}`
        }

        if(page && page!=='') {
            url += `${url.includes('?') ? '&' : '?'}page=${page}`
        }

        if(perPage && perPage!=='') {
            url += `${url.includes('?') ? '&' : '?'}perPage=${perPage}`
        }

        dispatch( {
            type: GETTING_AUDIT_LOGS,
            payload: true
        })

        const response = await axios.get(url, { headers })

        dispatch({
            type: GET_AUDIT_LOGS,
            payload: response.data.data
        })
        
    }
    catch(error){
        dispatch( {
            type: AUDIT_LOGS_ERROR,
            error
        })
    }
}