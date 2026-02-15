import React, { useEffect, useState } from 'react'
import Logo from '../../components/elements/Logo'
import InlinePreloader from '../../components/elements/InlinePreloader'
import { ERROR, SET_SUCCESS } from '../../store/types'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { baseUrl } from '../../utils'

const ConfirmEmail = () => {
  const [processing, setProcessing] = useState(true)
  const navigate = useNavigate()
  const {confirmationCode} = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        setProcessing(true)
        const payload = {
          confirmationCode  
        }
        await axios.post(`${baseUrl}/onboarding/email-confirmation`, payload)
        dispatch({
          type: SET_SUCCESS,
          payload: 'Email confirmed successfully, redirecting to login...'
        })
        setTimeout(() => {
          navigate('/')
        }, 5000);
      } catch (error) {
        console.error(error)
        dispatch({
            type: ERROR,
            error
        })
        setProcessing(false)
      }
    }

    confirmEmail()
  
    return () => {
      
    }
  }, [])
  
  return (
    // <LandingLayout>
    <section className='h-screen w-full bg-ss-pale-blue/50 flex items-start justify-center'>
      <div className='p-10 rounded-lg bg-white shadow-lg shadow-ss-black/5 h-inherit w-[30%] mt-10'>
        <Logo />
        {processing && <>
          <h3 className='text-2xl font-medium'>Hold On ...</h3>
          <p className='text-ss-dark-gray text-sm mt-2 mb-5'>Your email address is being confirmed. You will be redirected to the log in page once confirmation is complete.</p>
          <InlinePreloader />
        </>}
{/* 
        <p className='text-ss-dark-gray text-sm mt-2'>Need to create an account? <Link to={`/signup`} className='font-medium text-sm font-outfit text-blue-600 cursor-pointer inline-block'>Click here to sign up</Link></p>

        <div className='mt-5 w-full pt-5 border-t border-gray-300'>
          <TextField 
            requiredField={true}
            inputLabel="Email" 
            inputPlaceholder="Your registered email address"
            fieldId={`email`} 
            hasError={validationErrors.email} 
            returnFieldValue={()=>{}}
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
            returnFieldValue={()=>{}}
            preloadValue="" 
            disabled={false} 
          />
        </div>

        <p className='text-ss-dark-gray text-sm mt-5'>Forgot your password? <Link to={``} className='font-medium text-sm font-outfit text-blue-600 cursor-pointer inline-block'>Click here to create a new one</Link></p>

        <div className='mt-5 w-full'>
          <FormButton buttonAction={()=>{}} buttonLabel={`Log in to your business`} processing={processing} />
        </div> */}
      </div>
    </section>
    // </LandingLayout>
  )
}

export default ConfirmEmail