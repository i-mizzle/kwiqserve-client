import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authHeader, baseUrl, userDetails } from '../../../../utils';
import { ERROR, GETTING_USER_PROFILE, SET_SUCCESS } from '../../../../store/types';
import ConfirmationBox from '../../../../components/Layouts/ConfirmationBox';
import { resetUserPassword } from '../../../../store/actions/usersActions';
import Loader from '../../../../components/elements/Loader';
import TrashIcon from '../../../../components/elements/icons/TrashIcon';
import TextField from '../../../../components/elements/form/TextField';
import Checkbox from '../../../../components/elements/form/Checkbox';
import FormButton from '../../../../components/elements/form/FormButton';
import EmptyState from '../../../../components/elements/EmptyState';


const UserDetails = () => {
    const navigate = useNavigate()
    const { userId } = useParams()
    const dispatch = useDispatch()
    const usersState = useSelector((state => state.users))
    const [initialUserProfile, setInitialUserProfile] = useState({});
    const [administratorDetails, setAdministratorDetails] = useState(null);
    const [activeUserPermissions, setActiveUserPermissions] = useState([]);
    const [refresh] = useState(0);
    const [loadingUserProfile, setLoadingUserProfile] = useState(true);

    useEffect(() => {
        const getLoggedInUserProfile = async () => {    
            try{
                const headers = authHeader()
        
                dispatch({
                    type: GETTING_USER_PROFILE,
                    payload: true
                })
        
                const response = await axios.get(`${baseUrl}/user/profile`, { headers })
                setAdministratorDetails(response.data.data)
                // setActiveUserPermissions(userPermissions(response.data.data.permissions))
                setLoadingUserProfile(false)
                
            }
            catch(error){
                dispatch({
                    type: ERROR,
                    error
                })
            }
        }

        const getUserDetails = async (userId) => { 
            try{
                const headers = authHeader()
        
                dispatch({
                    type: GETTING_USER_PROFILE,
                    payload: true
                })
        
                const response = await axios.get(`${baseUrl}/users/profile/${userId}`, { headers })

                setAdministratorDetails(response.data.data)
                setInitialUserProfile(response.data.data)
                // setActiveUserPermissions(userPermissions(response.data.data.permissions))
                setLoadingUserProfile(false)
                
            }
            catch(error){
                console.log('error fetching user details: ', error)
                setLoadingUserProfile(false)
                dispatch({
                    type: ERROR,
                    error
                })
            }
        }

        if(userId === userDetails()._id) {
            getLoggedInUserProfile()
        } else {
            getUserDetails(userId)
        }

        if(usersState.updatedUser !== null) {
            dispatch({
                type: SET_SUCCESS,
                payload: "User updated successfully!"
            })
        }

        if(usersState.deletedUser !== null) {
            // setUpdateSuccess('user deleted successfully!')
            dispatch({
                type: SET_SUCCESS,
                payload: 'user deleted successfully!'
            })
            navigate('/user/users')
        }

        return () => {
            
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, usersState.updatedUser, usersState.deletedUser]);

     const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        let errors = {}
    
        if(!administratorDetails.name || administratorDetails.name === '') {
            errors.adminName = true
        }
        
        if(!administratorDetails.email || administratorDetails.email === '') {
            errors.email = true
        }
        
        if(!administratorDetails.phone || administratorDetails.phone === '') {
            errors.phone = true
        }
        
        if(!administratorDetails.username || administratorDetails.username === '') {
            errors.username = true
        }
            
        setValidationErrors(errors)
        return errors
    }

    const updateUser = () => {
        if (Object.values(validateForm()).includes(true)) {
            return
        }

        const userPermissions = activeUserPermissions
        .filter(permission => permission.selected === true)
        .map(permission => permission.value);


        const userUpdatePayload = {...administratorDetails, ...{
            permissions: userPermissions
        }}

        if(initialUserProfile.password !== administratorDetails.password) {
            userUpdatePayload.passwordChanged = false
        }

        delete userUpdatePayload.userType
        delete userUpdatePayload.emailConfirmed
        delete userUpdatePayload.createdAt
        delete userUpdatePayload.updatedAt
        delete userUpdatePayload.__v
        delete userUpdatePayload._id
        dispatch(updateUserProfile(userId, userUpdatePayload))
    }

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState(null);

    const doDeleteUser = async () => {
        setDeleteConfirmationMessage(`You are about to permanently delete the user "${administratorDetails.name}". This action cannot be reversed. Please confirm.`)
        setTimeout(() => {
            setShowDeleteConfirmation(true)
        }, 100);
    }

    const deleteAfterConfirm = () => {
        dispatch(deleteUser(userId))
        setShowDeleteConfirmation(false)
        setTimeout(() => {
            setDeleteConfirmationMessage(null)
        }, 50);
    }

    const [showResetPasswordConfirmation, setShowResetPasswordConfirmation] = useState(false);
    const [resetPasswordConfirmationMessage, setResetPasswordConfirmationMessage] = useState(null);

    const doResetPassword = async () => {
        setResetPasswordConfirmationMessage(`You are about to perform a password reset on behalf of this user. Please confirm to proceed.`)
        setTimeout(() => {
            setShowResetPasswordConfirmation(true)
        }, 100);
    }

    const resetAfterConfirm = () => {
        dispatch(resetUserPassword(userId))
        setShowResetPasswordConfirmation(false)
        setTimeout(() => {
            setResetPasswordConfirmationMessage(null)
        }, 50);
    }
    
    return (
        <>         
            {loadingUserProfile ? 
                <div className='mx-auto flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center rounded-lg mt-8'>
                    <Loader />
                </div>
            :
                <>
                    {administratorDetails !== null ? 
                    <div className='w-8/12 min-h-screen h-inherit'>
                        <div className={`w-full flex flex-row-reverse`}>
                            {userId !== userDetails()._id && <button onClick={()=>{doDeleteUser()}} className={`text-red-600 text-sm flex gap-x-2 hover:text-red-800`}>
                                <TrashIcon className={`w-5 h-5`} />
                                Delete this user
                            </button>} 
                        </div>
                        <div className='w-full mx-auto'>
                            <h1 className='text-3xl font-bold text-ss-dark-gray'>User Details</h1>
                            <p className='text-sm text-gray-600 mt-1'>You can update details by changing them below and clicking on "Update user"</p>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Full name" 
                                    fieldId="full-name" 
                                    inputType="text" 
                                    preloadValue={administratorDetails.name || ''}
                                    hasError={validationErrors && validationErrors.adminName} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{name: value}})}}
                                    disabled={true}
                                />
                            </div>

                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="ID Number" 
                                    fieldId="full-id-number" 
                                    inputType="text" 
                                    preloadValue={ administratorDetails.idNumber || ''}
                                    hasError={validationErrors && validationErrors.idNumber} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{idNumber: value}})}}
                                    disabled={true}
                                />
                            </div>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Email Address" 
                                    fieldId="email-address" 
                                    inputType="text" 
                                    preloadValue={ administratorDetails.email || ''}
                                    hasError={validationErrors && validationErrors.email} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{email: value}})}}
                                    disabled={true}
                                />
                            </div>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Phone number" 
                                    fieldId="phone-number" 
                                    inputType="text" 
                                    preloadValue={ administratorDetails.phone || ''}
                                    hasError={validationErrors && validationErrors.phone} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{phone: value}})}}
                                    disabled={true}
                                />
                            </div>

                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="username" 
                                    fieldId="username" 
                                    inputType="text" 
                                    preloadValue={ administratorDetails.username || ''}
                                    hasError={validationErrors && validationErrors.username} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{username: value}})}}
                                    disabled={true}
                                />
                            </div>

                            <div className='my-2 w-full'>
                                <h1 className='text-xl font-bold text-ss-dark-gray'>User Roles</h1>
                                <p className='text-sm text-gray-500 mt-1 mb-4'>A list of roles this user has on this platform.</p>
                                {/* {activeUserPermissions?.map((permission, permissionIndex)=>(<div key={permissionIndex} className="w-full flex items-center gap-x-4 my-2">
                                    <input id={permission.value} type='checkbox' checked={permission.selected === true} onChange={()=>(togglePermission(permissionIndex))} />
                                    <label htmlFor={permission.value} className='text-sm text-gray-500'>{permission.label}</label>
                                </div>))} */}
                                
                                <div className="w-full mt-5">
                                    {administratorDetails.businessRoles?.map((role, roleIndex) => (
                                        <div key={roleIndex} onClick={()=>{}} className={`cursor-pointer relative transition duration-200 hover:border-blue-300-300 w-full p-5 rounded-lg border-2 my-5 border-ss-dark-blue/60 bg-ss-pale-blue/40`}>
                                            <h3 className='font-[550] text-[15px] text-gray-800'>{role.name}</h3>
                                            <p className='text-sm text-gray-500'>{role.description}</p>
                                            <span className='absolute top-5 right-5'>
                                                <Checkbox isChecked={true} checkboxToggleFunction={()=>{}} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className='my-2 w-max'>
                                <FormButton buttonLabel="Update user" buttonAction={()=>{updateUser()}} processing={usersState.updatingUser} />
                            </div>

                            {userId !== userDetails()._id && <div className='w-full mt-8'>
                                
                                <div className='w-full'>
                                    <p className='text-gray-500 font-medium'>Password</p>
                                    <p className='text-sm text-gray-500 mt-1'>Set a new password for this user. this will only be a temporary password which the user will be required to change upon their next log in.</p>
                                    <p className='text-sm text-black mt-4'>Temporary password: <strong>Abcd1234!</strong></p>
                                    
                                    <button onClick={()=>{doResetPassword()}} className='font-medium transition text-sm block mt-6 duration-200 text-green-600 hover:text-gray-400'>Reset password for this user</button>
                                </div>
                            </div>}
                        </div>
                    </div> 
                    :
                    <div className='w-full mx-auto px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 text-xs text-center bg-black bg-opacity-10 rounded-lg mt-24'>
                        <div className="">
                            <EmptyState emptyStateText={`User details not found`} emptyStateTitle={`Not found`} />
                        </div>
                    </div>
                    }
                </>
            
            }

        
            {deleteConfirmationMessage && <ConfirmationBox
                isOpen={showDeleteConfirmation} 
                closeModal={()=>{setShowDeleteConfirmation(false)}} 
                confirmButtonAction={()=>{deleteAfterConfirm()}}                          
            >
                <p>{deleteConfirmationMessage}</p>
            </ConfirmationBox>}

            {resetPasswordConfirmationMessage && <ConfirmationBox
                isOpen={showResetPasswordConfirmation} 
                closeModal={()=>{setShowResetPasswordConfirmation(false)}} 
                confirmButtonAction={()=>{resetAfterConfirm()}}                          
            >
                <p>{resetPasswordConfirmationMessage}</p>
            </ConfirmationBox>}
        </>
    )

}

export default UserDetails