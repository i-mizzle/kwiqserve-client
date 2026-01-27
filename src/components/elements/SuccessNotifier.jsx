import React from 'react'
import { CLEAR_SUCCESS } from '../../store/types';
import { useDispatch, useSelector } from 'react-redux';
import SuccessMessage from './SuccessMessage';

const SuccessNotifier = () => {
    const dispatch = useDispatch();
    const success = useSelector(state => state.success);

    const dismissHandler = () => {
        dispatch( {
            type: CLEAR_SUCCESS,
            payload: null
        })
    }

    if (!success.successMessage || success.successMessage === null) return null;

    if(success ) {
        setTimeout(() => {
            dismissHandler()
        }, 10000);
        
        return (
            <SuccessMessage message={success.successMessage} dismissHandler={()=>{dismissHandler()}} />
        )
    }

}

export default SuccessNotifier