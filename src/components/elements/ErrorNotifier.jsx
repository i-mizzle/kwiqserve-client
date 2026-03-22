import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_ERROR } from '../../store/types';
import ErrorMessage from './ErrorMessage';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useLocation, useNavigate } from 'react-router-dom';
// import LoginModal from './LoginModal';

const ErrorNotifier = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation()
    const [hasNavigated, setHasNavigated] = useState(false); 

    const error = useSelector(state => state?.errors?.error);
    const dismissHandler = () => {
        dispatch( {
            type: CLEAR_ERROR
        })
    }

    // Handle unauthorized error and navigation
    useEffect(() => {
        console.log('error notifier: ', error)
        if (error && error.response.status === 401 && !hasNavigated && location.pathname !== '') {
            const currentRoute = location.pathname + location.search;
            setHasNavigated(true); // Mark navigation as done
            navigate({
                pathname: '/',
                search: `?return=${encodeURIComponent(currentRoute)}`
            });
            // Immediately clear the error to prevent further triggers
            dispatch({
                type: CLEAR_ERROR
            });
        }
    }, [error, hasNavigated, location, navigate, dispatch]);

    if (!error) return null;

    // if (error && error.errorCode !== 'unauthorized' && error.errorCode !== 'forbidden') {
    if (error) {
        console.log('error notifier: ', error)
        setTimeout(() => {
            dismissHandler()
        }, 5000);
        
        return (
            <ErrorMessage message={error.response.data.message} dismissHandler={()=>{dismissHandler()}} />
            // <ErrorMessage message={error.message} dismissHandler={()=>{dismissHandler()}} />
        )
    }
}

export default ErrorNotifier
