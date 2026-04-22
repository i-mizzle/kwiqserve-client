import React, { useEffect, useState } from 'react'
import TextField from '../../components/elements/form/TextField'
import PasswordField from '../../components/elements/form/PasswordField'
import FormButton from '../../components/elements/form/FormButton'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../../components/elements/Logo'
import { ERROR } from '../../store/types'
import { baseUrl } from '../../utils'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import InlinePreloader from '../../components/elements/InlinePreloader'
import { fetchStoreSettings } from '../../store/actions/settingsActions'

const Login = () => {
  const [validationErrors, setValidationErrors] = useState({})
  const [processing, setProcessing] = useState(false)

    const navigate = useNavigate()
  const [authPayload, setAuthPayload] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [ searchParams, setSearchParams ] = useSearchParams();
  const dispatch = useDispatch()
  const [storeError, setStoreError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(searchParams.get('expiredToken') && searchParams.get('expiredToken') === 'true') {
      setError('Sorry, your session expired, please log in to continue')
    }

    const getStoreDetails = async () => {
      try {

        const headers = {
          "x-original-host": window.location.host,
        }

        const response = await axios.get(`${baseUrl}/business`, {headers})
        // if(response.data.data){
        localStorage.setItem("currentBusiness", JSON.stringify(response.data.data));

        setLoading(false)


        // const subscriptionResponse = await axios.get(`${baseUrl}/current-subscription`, {headers})
        // localStorage.setItem("activeSubscription", JSON.stringify(subscriptionResponse.data.data))

      } catch (error) {
        console.error('Error fetching store:', error);
        dispatch({
          type: ERROR,
          error
        })
        setStoreError(true)
        setLoading(false)
      }
    };
  
    getStoreDetails();
  }, [dispatch, searchParams]);
  
  const validateForm = () => {
    let errors = {}

    if(!authPayload.username || authPayload.username === '') {
        errors.username = true
    }

    if(!authPayload.password || authPayload.password === '') {
        errors.password = true
    }
        
    setValidationErrors(errors)
    return errors
  }

  const [error, setError] = useState(null);

  const createSession = async () => {
    if (Object.values(validateForm()).includes(true)) {
      dispatch({
        type: ERROR,
        error: {response: {data: {message: 'Form validation failed. Please check highlighted fields'}}}
      })
      return
    }

    try {
      const payload = {
        username: authPayload.username,
        password: authPayload.password
      }

      const headers = {
        "x-original-host": window.location.host,
      }

      setProcessing(true)

      const response = await axios.post(`${baseUrl}/auth/sessions`, payload, {headers})
      localStorage.setItem('hideSetupReminder', 'no')
      const authToken = response.data.data.accessToken
      dispatch(fetchStoreSettings())
      getUserDetails(authToken)
    } catch (error) {
      setError(error.response.data.message)
      setProcessing(false)
      console.error('Error creating session:', error);
      dispatch({
        type: ERROR,
        error
      })
      setProcessing(false)
    }
  }

  const getUserDetails = async (authToken) => {      
    try {
        const headers = {headers: { 
          Authorization: 'Bearer ' + authToken,
          "x-original-host": window.location.host,
        }}

        const response = await axios.get(`${baseUrl}/user/profile`, headers)
        const user = response.data.data

        localStorage.setItem("user", JSON.stringify({...user, ...{authToken}}));

        if(searchParams.get('returnUrl') && searchParams.get('returnUrl') !== ''  && searchParams.get('returnUrl') !== '/') {
          navigate(searchParams.get('returnUrl'))
        } else {
          if(!user.passwordChanged) {
            navigate('/business/change-password')
          } else{
            // if(localStorage.getItem("gettingStartedSkipped") === 'yes'){
              navigate('/business/dashboard')
            // } else{
            //   navigate('/business/dashboard/getting-started')
            // }
          }
        }
        setError('')
    } catch (error) {
        console.error('Error fetching and setting user details:', error);
        // setCreating(false)
        // setError(error.response.data.message)
        // dispatch({
        //   type: ERROR,
        //   error
        // })
        setProcessing(false)
    }
  }

  return (
    <section className='h-screen w-full bg-ss-pale-blue/50 flex items-start justify-center'>
      <div className='p-8 lg:p-10 rounded-lg bg-white shadow-lg shadow-ss-black/5 mt-10 h-inherit w-[90%] lg:w-[60%] xl:w-[30%]'>
        <Logo />
        {loading ? 
          <div className='flex flex-col items-center justify-center p-10'>
            <InlinePreloader />
            <p className='text-ss-dark-gray text-sm mt-4'>Loading your business...</p>
          </div>
          :
          <>
            {storeError ? 
              <div className='w-full p-10 bg-gray-50'>
                <h3 className='text-xl font-medium mb-3'>Store Error</h3>
                <p className='text-sm text-ss-dark-gray'>THee was an error fetching your store. please confirm you have entered the correct store domain in the url or contact support (<a href='mailto:support@kwiqserve.com' className='font-medium'>support@kwiqserve.com</a>) fo assistance.</p>
              </div>
            : 
              <>
                <h3 className='text-xl font-medium mt-5'>Welcome</h3>
                <p className='text-ss-dark-gray text-sm mt-2'>Please provide your registered credentials below to log in to your business</p>

                <p className='text-ss-dark-gray text-sm mt-2'>Need to create an account? <Link to={`https://kwiqserve.com/signup`} target='_blank' className='font-medium text-sm font-outfit text-blue-600 cursor-pointer inline-block'>Click here to sign up</Link></p>

                <div className='mt-5 w-full pt-5 border-t border-gray-300'>
                  <TextField 
                    requiredField={true}
                    inputLabel="Email or username" 
                    inputPlaceholder="Your registered username or email address"
                    fieldId={`email`} 
                    hasError={validationErrors.username} 
                    returnFieldValue={(value)=>{setAuthPayload({...authPayload, username: value})}}
                    preloadValue="" 
                    disabled={false} 
                  />
                </div>

                <div className='mt-2 w-full'>
                  <PasswordField
                    requiredField={true}
                    inputLabel="Password" 
                    inputPlaceholder="Your password"
                    fieldId={`password`} 
                    hasError={validationErrors.password} 
                    returnFieldValue={(value)=>{setAuthPayload({...authPayload, password: value})}}
                    preloadValue="" 
                    disabled={false} 
                  />
                </div>

                <p className='text-ss-dark-gray text-sm mt-5'>Forgot your password? <Link to={``} className='font-medium text-sm font-outfit text-blue-600 cursor-pointer inline-block'>Click here to create a new one</Link></p>

                <div className='mt-5 w-full'>
                  <FormButton buttonAction={()=>{createSession()}} buttonLabel={`Log in to your business`} processing={processing} />
                </div>
              </>}
          </>
        }

      </div>
    </section>
  )
}

export default Login