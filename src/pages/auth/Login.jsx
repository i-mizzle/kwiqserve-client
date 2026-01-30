import React, { useState } from 'react'
import TextField from '../../components/elements/form/TextField'
import PasswordField from '../../components/elements/form/PasswordField'
import FormButton from '../../components/elements/form/FormButton'
import { Link } from 'react-router-dom'
import Logo from '../../components/elements/Logo'

const Login = () => {
  const [validationErrors, setValidationErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  return (
    // <LandingLayout>
      <section className='h-screen w-full bg-ss-pale-blue/50 flex items-center justify-center'>
        <div className='p-10 rounded-lg bg-white shadow-lg shadow-ss-black/5 h-inherit w-[30%]'>
          <Logo />
          <h3 className='text-2xl font-medium'>Welcome</h3>
          <p className='text-ss-dark-gray text-sm mt-2'>Please provide your registered credentials below to log in to your business</p>

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
          </div>
        </div>
      </section>
    // </LandingLayout>
  )
}

export default Login