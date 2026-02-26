import React from 'react'
import { CLEAR_NOTIFICATION } from '../../store/types';
import { useDispatch, useSelector } from 'react-redux';
import NotificationMessage from './NotificationMessage';

const Notifier = () => {
    const dispatch = useDispatch();
    const notification = useSelector(state => state.notification);

    const dismissHandler = () => {
        dispatch( {
            type: CLEAR_NOTIFICATION,
            payload: null
        })
    }

    if (!notification.notificationMessage || notification.notificationMessage === null) return null;

    if(notification ) {
        setTimeout(() => {
            dismissHandler()
        }, 10000);
        
        return (
            <NotificationMessage message={notification.notificationMessage} dismissHandler={()=>{dismissHandler()}} />
        )
    }

}

export default Notifier