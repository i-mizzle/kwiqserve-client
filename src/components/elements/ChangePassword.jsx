import React, { useEffect, useState } from 'react'
import PasswordField from './form/PasswordField';
import { ERROR } from '../../store/types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FormButton from './form/FormButton';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
    
    }, []);

    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        let errors = {}
    
        if(!oldPassword || oldPassword === '') {
            errors.oldPassword = true
        }
    
        if(!newPassword || newPassword === '') {
            errors.newPassword = true
        }
            
        setValidationErrors(errors)
        return errors
    }

    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const setUserPassword = async () => {
        if (Object.values(validateForm()).includes(true)) {
            return
        }

        try {
            const headers = {headers: authHeader()}

            const payload = {
                password: oldPassword,
                newPassword: newPassword
            }
    
            setProcessing(true)
    
            await axios.post(`${baseUrl}/user/change-password`, payload, headers)
            setUpdateSuccess('Password updated successfully! logging you in...')
            updateUserProfile()
            
        } catch (error) {
            console.error('Error setting password:', error);
            dispatch({
                type: ERROR,
                error
            })
        }
    }
    return (
        <div className='w-full'>
            <div className='w-full'>
                <p className='text-sm text-gray-500 mt-1'>Provide your current password here and a new password to change your password</p>
                
                <div className='mb-2 mt-4 w-full'>
                    <PasswordField
                        inputLabel="Current password" 
                        fieldId="password-old" 
                        inputType="password" 
                        preloadValue={''}
                        inputPlaceholder={`The password used to login`}
                        hasError={validationErrors && validationErrors.oldPassword} 
                        returnFieldValue={(value)=>{setOldPassword(value)}}
                    />
                </div>
                <div className='my-2 w-full'>
                    <PasswordField
                        inputLabel="Choose a new Password" 
                        fieldId="password-new" 
                        inputType="password" 
                        preloadValue={''}
                        inputPlaceholder={`Create a secure password`}
                        showPasswordMeter={true}
                        hasError={validationErrors && validationErrors.newPassword} 
                        returnFieldValue={(value)=>{setNewPassword(value)}}
                    />
                </div>
            </div>

            <div className='mt-5 w-full'>
                <FormButton buttonLabel="Change your password" buttonAction={()=>{setUserPassword()}} processing={processing} />
            </div>
        </div>
    )
}

export default ChangePassword