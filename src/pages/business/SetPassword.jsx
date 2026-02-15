import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/elements/form/TextField';
import FormButton from '../../components/elements/form/FormButton';
import SuccessMessage from '../../components/elements/SuccessMessage'
import ErrorMessage from '../../components/elements/ErrorMessage'
// import db from '../../db';
import { ERROR } from '../../store/types';
import { authHeader, baseUrl } from '../../utils';
import axios from 'axios';
import PasswordField from '../../components/elements/form/PasswordField';
import { useDispatch } from 'react-redux';

const SetPassword = () => {
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

    const updateUserProfile = async () => {
        if (Object.values(validateForm()).includes(true)) {
            return
        }

        try {
            const headers = {headers: authHeader()}

            const payload = {
                passwordChanged: true
            }
    
            setProcessing(true)
    
            await axios.patch(`${baseUrl}/user/profile`, payload, headers)
            navigate('/business')
            
        } catch (error) {
            console.error('Error creating session:', error);
            dispatch({
                type: ERROR,
                error
            })
        }
    }


    return (
        <>
            {updateSuccess && updateSuccess !== '' && <SuccessMessage message={updateSuccess} dismissHandler={()=>{setUpdateSuccess(null)}} />}
            {updateError && updateError !== '' && <ErrorMessage message={updateError} dismissHandler={()=>{setUpdateError(null)}} />}
            <div className='w-full min-h-screen h-inherit bg-ss-pale-blue bg-opacity-50 pt-12'>
                <div className='w-10/12 md:w-8/12 xl:w-6/12 2xl:w-4/12 mx-auto'>
                    <div className='bg-white rounded-md p-10 shadow-lg shadow-ss-black/5'>

                        <div className='w-full'>
                            <p className='text-gray800 font-medium'>Change your password</p>
                            <p className='text-sm text-gray-500 mt-1'>This is your first log in. Please provide your own password below. Fill in the temporary password along with the new password you were issued</p>
                            
                            <div className='mb-2 w-full'>
                                <PasswordField
                                    inputLabel="Temporary password" 
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
                            <FormButton buttonLabel="Set your password" buttonAction={()=>{setUserPassword()}} processing={processing} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SetPassword