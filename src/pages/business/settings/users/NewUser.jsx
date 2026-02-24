import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ModalDialog from '../../../../components/Layouts/ModalDialog';
import NewRole from '../../../../components/elements/roles/NewRole';
import TextField from '../../../../components/elements/form/TextField';
import PlusIcon from '../../../../components/elements/icons/PlusIcon';
import Loader from '../../../../components/elements/Loader';
import FormButton from '../../../../components/elements/form/FormButton';
import { fetchRoles } from '../../../../store/actions/rolesPermissionsActions';
import EmptyState from '../../../../components/elements/EmptyState';
import Checkbox from '../../../../components/elements/form/Checkbox';
import { authHeader, baseUrl } from '../../../../utils';
import { ERROR, SET_SUCCESS } from '../../../../store/types';


const NewUser = () => {
    const navigate = useNavigate()    
    const dispatch = useDispatch()
    const rolesSelector = useSelector(state => state.roles)

    const [administratorDetails, setAdministratorDetails] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        dispatch(fetchRoles())

        if(rolesSelector.createdRole & rolesSelector.createdRole !== null) {
            setCreatingRole(false)
        }
        
        return () => {
            
        }
    }, [dispatch, refresh, rolesSelector.createdRole])
    

    const validateForm = () => {
        let errors = {}
    
        if(!administratorDetails.name || administratorDetails.name === '') {
            errors.adminName = true
        }
    
        if(!administratorDetails.idNumber || administratorDetails.idNumber === '') {
            errors.idNumber = true
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
        
        if(!administratorDetails.password || administratorDetails.password === '') {
            errors.password = true
        }

        if(!selectedRoles || selectedRoles.length === 0) {
            errors.roles = true
        }
            
        setValidationErrors(errors)
        return errors
    }

    const createUser = async () => {
        if (Object.values(validateForm()).includes(true)) {
            dispatch({
                type: ERROR,
                error: {response: {data: {message: 'Form validation failed: Please check highlighted fields.'}}}
            })
            return
        }

        try {
            const headers = authHeader()

            const data = {...administratorDetails, ...{
                roles: selectedRoles.map(role => role._id),
                password: administratorDetails.password,
                passwordChanged: false,
                // dateCreated: new Date()
            }}

            // const response = await db.put(data);
            await axios.post(`${baseUrl}/users/create-user`, data, {headers})
            dispatch({
                type: SET_SUCCESS,
                payload: 'New user created successfully!'
            })
            navigate('/business/settings/users')
            
            // setRefresh(refresh+1)
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    const [creatingRole, setCreatingRole] = useState(false)

    const [selectedRoles, setSelectedRoles] = useState([])

    const toggleRole = (role) => {
        let temp = [...selectedRoles]
        const selectedIndex = temp.findIndex(tempRole => role._id === tempRole._id)
        if(selectedIndex > -1) {
            temp.splice(selectedIndex, 1)
        } else {
            temp.push(role)
        }
        setSelectedRoles(temp)
    }

    const roleSelected = (role) => {
        let temp = [...selectedRoles]
        const selectedIndex = temp.findIndex(tempRole => role._id === tempRole._id)
        return selectedIndex > -1

    }
    
    return (
        <>

            <div className='w-full min-h-screen h-inherit'>
                <div className='w-full xl:flex items-stretch justify-center gap-x-5'>
                    <div className={`w-full xl:w-7/12 2xl:w-8/12 bg-white rounded-lg lg:mr-0`}>
                        <div className=''>
                            <h1 className='text-3xl font-bold text-ss-dark-gray'>Create a new user</h1>
                            <p className='text-sm text-gray-500 mt-1'>Please provide details of the new user below</p>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Full name" 
                                    fieldId="full-name" 
                                    inputType="text" 
                                    inputPlaceholder={`Employee's full name`}
                                    preloadValue={''}
                                    hasError={validationErrors && validationErrors.adminName} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{name: value}})}}
                                />
                            </div>

                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="ID Number" 
                                    fieldId="full-id-number" 
                                    inputType="text" 
                                    preloadValue={''}
                                    inputPlaceholder={`Employee ID of user (if available)`}
                                    hasError={validationErrors && validationErrors.idNumber} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{idNumber: value}})}}
                                />
                            </div>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Email Address" 
                                    fieldId="email-address" 
                                    inputType="text" 
                                    preloadValue={''}
                                    inputPlaceholder={`Active email address`}
                                    hasError={validationErrors && validationErrors.email} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{email: value}})}}
                                />
                            </div>
        
                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Phone number" 
                                    fieldId="phone-number" 
                                    inputType="text" 
                                    preloadValue={''}
                                    inputPlaceholder={`Active phone number`}
                                    hasError={validationErrors && validationErrors.phone} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{phone: value}})}}
                                />
                            </div>

                            <div className='my-2 w-full'>
                                <TextField
                                    inputLabel="Username" 
                                    fieldId="username" 
                                    inputType="text" 
                                    preloadValue={''}
                                    inputPlaceholder={`Create a username for the new user`}
                                    hasError={validationErrors && validationErrors.username} 
                                    returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{username: value}})}}
                                />
                            </div>

                            {/* <div className='my-4 w-full'>
                                <h3 className='text-gray-700 font-medium'>User Permissions</h3>
                                <p className='text-sm text-gray-500 mt-1 mb-4'>Toggle permissions for the user. These will determine the areas the user will be able to access</p>
                                {permissions.map((permission, permissionIndex)=>(<div key={permissionIndex} className="w-full flex items-center gap-x-4 my-2">
                                    <input id={permission.value} type='checkbox' onChange={()=>(togglePermission(permissionIndex))} />
                                    <label htmlFor={permission.value} className='text-sm text-gray-500'>{permission.label}</label>
                                </div>))}
                            </div> */}

                            <div className='w-full mt-8'>
                                <h3 className='text-gray-700 font-medium'>Password</h3>
                                <p className='text-sm text-gray-500 mt-1'>Create a password for this user. this will only be a temporary password which the user will be required to change upon their first log in</p>
                                
                                <div className='my-2 w-full'>
                                    <TextField
                                        inputLabel="Choose a Password" 
                                        fieldId="password" 
                                        inputType="password" 
                                        preloadValue={''}
                                        inputPlaceholder={`5ecur3p#ssw0rd`}
                                        hasError={validationErrors && validationErrors.password} 
                                        returnFieldValue={(value)=>{setAdministratorDetails({...administratorDetails, ...{password: value}})}}
                                    />
                                </div>
                                {/* <label className="block text-sm mt-2 text-gray-400"></label> */}
                            </div>
                            {/* <div className='w-full text-center'>
                            <p className='text-gray-400 text-sm'>Forgot your password? <Link className='text-blue-500 font-medium' to='password-reset'>Click here</Link> to get a new one</p>
                            </div> */}
                        </div>
                    </div>
                    {<div className='w-full lg:mr-auto lg:ml-0 lg:w-8/12 xl:w-6/12 2xl:w-4/12 bg-white rounded-lg mt-5 xl:mt-0'>
                        <div className=''>
                            <h3 className='text-xl text-ss-dark-gray font-semibold'>System Roles</h3>
                            <p className='text-sm text-gray-500 mt-1'>Select all roles for this user (you can add multiple roles to the user). You can create a new role any time by clicking on the "Create New Role" button below.</p>

                            <button onClick={()=>{setCreatingRole(true)}} className='flex gap-x-2 items-center bg-ss-dark-blue border border-ss-dark-blue mt-4 px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black font-[550] cursor-pointer'>
                                <PlusIcon className={`h-5 w-5`} />
                                Create New Role
                            </button>
                            {rolesSelector?.loadingRoles ? 
                                <Loader />
                                :
                                <div className='w-full'>
                                    {rolesSelector.roles?.roles?.length > 0 ?
                                        <div className="w-full mt-10">
                                            {rolesSelector.roles.roles.map((role, roleIndex) => (
                                                <div key={roleIndex} onClick={()=>{toggleRole(role)}} className={`cursor-pointer relative transition duration-200 hover:border-blue-300 w-full p-5 rounded-lg border-2 my-5 ${roleSelected(role) ? 'border-ss0dark0-blue bg-ss-pale-blue/40 ' : 'border-transparent bg-gray-50'}`}>
                                                    <h3 className='font-[550] text-[15px] text-gray-800'>{role.name}</h3>
                                                    <p className='text-sm text-gray-500 w-[90%]'>{role.description}</p>
                                                    <span className='absolute top-5 right-2'>
                                                        <Checkbox isChecked={roleSelected(role)} checkboxToggleFunction={()=>{toggleRole(role)}} />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    :
                                        <div className='w-full'>
                                            <EmptyState emptyStateTitle={`No roles found for your business`} emptyStateText={`Please create some roles first by clicking on "Create Role" above`} />
                                        </div>
                                    }
                                </div>
                            }
                        </div>

                    </div>}
                </div>

                <div className='my-8 lg:w-2/3 xl:w-1/3 w-[90%]'>
                    <FormButton buttonLabel="Create user for your business" buttonAction={()=>{createUser()}} />
                </div>
            </div>

            <ModalDialog
                shown={creatingRole} 
                closeFunction={()=>{setCreatingRole(false)}} 
                dialogTitle='Create a role'
                dialogIntro={`Create a new role for users in your business`}
                maxWidthClass='max-w-xl'
            >
                <NewRole 
                    close={()=>{setCreatingRole(false)}} 
                    reload={()=>{setRefresh(refresh+1)}}
                />
            </ModalDialog>
        </>
    )
}

export default NewUser