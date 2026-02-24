import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ERROR } from '../../../store/types'
import { authHeader, baseUrl } from '../../../utils'
import axios from 'axios'
import Loader from '../../../components/elements/Loader'
import TextField from '../../../components/elements/form/TextField'
import PasswordField from '../../../components/elements/form/PasswordField'
import FormButton from '../../../components/elements/form/FormButton'
import SetPassword from '../SetPassword'
import ModalDialog from '../../../components/Layouts/ModalDialog'
import ChangePassword from '../../../components/elements/ChangePassword'

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = authHeader()

        setLoading(true)
        const response = await axios.get(`${baseUrl}/user/profile`, {headers})
        setUserProfile(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log('error fetching user profile: ', error)
        dispatch({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    }
    fetchUserProfile()
    return () => {
      
    }
  }, [])

  const [changingPassword, setChangingPassword] = useState(false)
  
  return (
    <>
      <div className="w-full">
        {loading ? 
          <Loader />
        : 
        <>
          <div className='w-8/12 pb-10 border-b border-gray-300 mb-5'>
            <h1 className='text-3xl font-bold text-ss-dark-gray'>User Profile</h1>
            <p className='text-gray-500 text-sm'>Please see details of your user account below. You can change any details you need to and click on "Update Profile" to save updates.</p>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="user-name"
                inputLabel="Name" 
                preloadValue={userProfile.name || ''}
                inputPlaceholder={`Choose a category name`}
                hasError={validationErrors.name} 
                returnFieldValue={(value)=>{setUserProfile({...userProfile, ...{name: value}})}}
              />
            </div>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="user-name"
                inputLabel="Username" 
                preloadValue={userProfile.username || ''}
                inputPlaceholder={`Choose a username`}
                hasError={validationErrors.name} 
                returnFieldValue={(value)=>{setUserProfile({...userProfile, ...{username: value}})}}
              />
            </div>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="user-name"
                inputLabel="Email Address" 
                preloadValue={userProfile.email || ''}
                inputPlaceholder={`Your email address`}
                hasError={validationErrors.name} 
                disabled={true}
                returnFieldValue={(value)=>{setUserProfile({...userProfile, ...{email: value}})}}
              />
            </div>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="phone-number"
                inputLabel="Phone number" 
                preloadValue={userProfile.phone || ''}
                inputPlaceholder={`Choose a category name`}
                hasError={validationErrors.name} 
                returnFieldValue={(value)=>{setUserProfile({...userProfile, ...{name: value}})}}
              />
            </div>

            <div className='w-max mt-4'>
              <FormButton buttonLabel={`Update Profile`} buttonAction={()=>{}} />
            </div>
          </div>

          <div className='w-8/12'>
            <h1 className='text-xl font-bold text-ss-dark-gray'>Security</h1>
            <p className='text-gray-500 text-sm'>Create and manage menus for your menu items. Click on a price card to view details or create a new one by clicking "Create a Menu"</p>

            <div className='w-full mt-4'>
              <PasswordField
                inputType="text" 
                fieldId="user-name"
                inputLabel="Password" 
                preloadValue={`SecurePassword`}
                inputPlaceholder={`Choose a password`}
                hasError={validationErrors.name} 
                returnFieldValue={(value)=>{}}
                disabled={true}
              />
            </div>
            <div className='w-max mt-4'>
              <FormButton buttonLabel={`Change your password`} buttonAction={()=>{setChangingPassword(true)}} />
            </div>
          </div>
        </>}
      </div>
      <ModalDialog
        shown={changingPassword} 
        closeFunction={()=>{setChangingPassword(false)}} 
        dialogTitle='Create a new password'
        // dialogIntro={`Create a category for store or sale items`}
        maxWidthClass='max-w-lg'
      >
          <ChangePassword />
      </ModalDialog>
    </>
  )
}

export default Profile