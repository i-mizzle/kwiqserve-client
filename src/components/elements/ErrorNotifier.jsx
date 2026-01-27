import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_ERROR } from '../../store/types';
import ErrorMessage from './ErrorMessage';
// import { useLocation, useNavigate } from 'react-router-dom';
// import LoginModal from './LoginModal';

const ErrorNotifier = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate()
    // const location = useLocation()

    const error = useSelector(state => state?.errors?.error);
    const dismissHandler = () => {
        dispatch( {
            type: CLEAR_ERROR
        })
    }

    if (!error) return null;

    // if (error && (error.errorCode === 'unauthorized' || error.errorCode === 'forbidden')) {
    //     navigate({
    //         pathname: '/',
    //         search: "?" + new URLSearchParams({
    //             returnUrl: location.pathname, 
    //             expiredToken: true}).toString()
    //     })

    //     // return (
    //     //     <ErrorMessage message={`Your log in session has expired, please log in again to continue.`} dismissHandler={()=>{dismissHandler()}} />
    //     // )
    // }

    // if (error && error.errorCode !== 'unauthorized' && error.errorCode !== 'forbidden') {
    if (error) {
        console.log('error notifier: ', error)
        setTimeout(() => {
            dismissHandler()
        }, 5000);
        
        return (
            <ErrorMessage message={error.message} dismissHandler={()=>{dismissHandler()}} />
        )
    }
}

export default ErrorNotifier
