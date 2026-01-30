import React, { act, useState } from 'react'
import Logo from '../../components/elements/Logo'
import TextField from '../../components/elements/form/TextField'
import { Link } from 'react-router-dom'
import PasswordField from '../../components/elements/form/PasswordField'
import FormButton from '../../components/elements/form/FormButton'
import ArrowIcon from '../../components/elements/icons/ArrowIcon'
import AutocompleteSelect from '../../components/elements/form/AutocompleteSelect'
import SelectField from '../../components/elements/form/SelectField'
import { ERROR } from '../../store/types'
import { debounce } from '../../utils'
import { useDispatch } from 'react-redux'

const Signup = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch = useDispatch()
  const [userPayload, setUserPayload] = useState({})
  const [businessPayload, setBusinessPayload] = useState({})

  const proceed = () => {
    if(activeStep === 1) {
      completeStep1()
    }

    if(activeStep === 2) {
      signup()
    }

    return
  }

  const validateStep1 = () => {
    let errors = {}

    setValidationErrors(errors)
    return errors
  }

  const completeStep1 = () => {
    setActiveStep(2)
  }

  const [invalidSubdomain, setInvalidSubdomain] = useState(false)

  function isValidSubdomain(name) {
    const regex = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;
    return regex.test(name);
  }

  const [validatingSubdomain, setValidatingSubdomain] = useState(false)
  const [subdomainValidated, setSubdomainValidated] = useState(false)
  const [subdomainAvailable, setSubdomainAvailable] = useState(false)

  const validateSubdomain  = debounce(async (subdomain) => {
    try {
      setValidatingSubdomain(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/validate-subdomain/${subdomain}`)
      setSubdomainAvailable(response.data.data.available)
      setSubdomainValidated(true)
      setValidatingSubdomain(false)
      if(response.data.data.available){
        setStoreDetails({...businessPayload, ...{subdomain: subdomain}})
      }
    } catch (error) {
      console.error(error)
      dispatch({
          type: ERROR,
          error
      })
      setValidatingSubdomain(false)
      setSubdomainValidated(false)
    }
  })

  const validateStep2 = () => {
    let errors = {}

    if(!businessPayload.name || businessPayload.name === '') {
      errors.name = true
    }

    if(!businessPayload.address || businessPayload.address === '') {
      errors.address = true
    }

    if(!businessPayload.city || businessPayload.city === '') {
      errors.city = true
    }

    // if(!businessPayload.phone || businessPayload.phone === '') {
    //   errors.storePhone = true
    // }
    
    // if(!businessPayload.email || businessPayload.email === '') {
    //   errors.storeEmail = true
    // }

    if(!businessPayload.subdomain || businessPayload.subdomain === '') {
      errors.subdomain = true
    }

    if(businessPayload.subdomain && !isValidSubdomain(businessPayload.subdomain)){
      errors.subdomain = true
      setInvalidSubdomain(true)
    }
    
    if(!businessPayload.state || businessPayload.state === '') {
      errors.state = true
    }

    setValidationErrors(errors)
    return errors
  }

  const signup = async () => {
    if (Object.values(validateStep2()).includes(true)) {
      return
    }
    
    try {
      const data = {...businessPayload, ...{
          createdBy: userId
      }}
      await axios.post(`${baseUrl}/store`, data)
      setCreating(false)
      // dispatch({})
      // navigate('/')
      setShowConfetti(true)
      setSignedUp(true)
      setOtpSent(true)

    } catch (error) {
      console.error('Error creating store:', error);
      setCreating(false)
      // setError(error.response.data.message || 'Sorry a server error occurred.')
      dispatch({
          type: ERROR,
          error
      })
    }
  }

  const resendConfirmationCode = async () => {
    if (Object.values(validateForm()).includes(true)) {
      dispatch({
        type: ERROR,
        payload: {response: {data: {message: 'Please check highlighted fields'}}}
      })
    }

    try {
      const payload = {
        email: administratorDetails.email
      }

      setProcessing(true)

      await axios.post(`${process.env.REACT_APP_API_URL}/onboarding/email-confirmation/resend`, payload)

      setProcessing(false)
      setOtpSent(true)
    } 
    catch (error) {
      setProcessing(false)
      console.error('Error creating session:', error);
      dispatch({
        type: ERROR,
        error
      })
    }
  }

  return (
    <section className='w-full min-h-screen h-inherit bg-ss-pale-blue'>
      <div className='w-full flex items-start justify-between gap-x-5 relative'>
        <div className='w-1/3 py-10 px-14 relative h-screen'>
          <Logo />

          <div className='mt-20'>
            <h3 className='font-bold text-5xl text-ss-dark-blue mb-6'>
              Run your venue without the wait.
            </h3>

            <p className='text-ss-dark-gray'>
              Scanserve lets your guests scan, order, and pay from their table — no queues, no shouting, no delays. You stay in control of menus, tables, and orders, while your staff focuses on great service.
            </p>
          </div>

          <div className='w-[95%] absolute bottom-0 z-1 -right-[5%] h-125 bg-white rounded-lg' />
        </div>

        <div className='w-2/3 bg-white rounded-lg z-990 p-5 shadow-xl shadow-ss-black/10 min-h-screen h-inherit'>
          <div className='w-1/2 mx-auto mt-26'>
            <h3 className='font-bold text-2xl text-ss-dark-blue mb-1'>
              Create an account for your business
            </h3>
            <p className='text-sm text-ss-dark-gray'>
              Please provide your details below to get started
            </p>

            <p className='text-gray-500 text-sm mt-1'>Already have an account? <Link to={`/signup`} className='font-medium text-sm font-outfit text-blue-600 cursor-pointer inline-block'>Click here to log in</Link></p>
            <div className='flex items-end justify-between mt-2'>
              {activeStep === 1 && <p className='mt-3 font-medium text-sm w-max'>Step 1 of 2: User Details</p>}
              {activeStep === 2 && <p className='mt-3 font-medium text-sm w-max'>Step 2 of 2: Business Information</p>}
              {activeStep === 1 && <p className='mt-3 text-gray-400 text-sm w-max flex items-center justify-center gap-x-1'>Next: Business Information <ArrowIcon className={`w-4 h-4`} /></p>}
            </div>

            {activeStep === 1 && <>
              <div className='mt-2 w-full'>
                <TextField 
                  requiredField={true}
                  inputLabel="Name" 
                  inputPlaceholder="Your full name"
                  fieldId={`name`} 
                  hasError={validationErrors.name} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                />
              </div>

              <div className='mt-2 w-full'>
                <TextField 
                  requiredField={true}
                  inputLabel="Email" 
                  inputPlaceholder="Your active email address"
                  fieldId={`email`} 
                  hasError={validationErrors.email} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                />
              </div>

              <div className='mt-2 w-full'>
                <TextField 
                  requiredField={true}
                  inputLabel="Phone number" 
                  inputPlaceholder="Your active phone number"
                  fieldId={`phone`} 
                  hasError={validationErrors.phone} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                />
              </div>

              <div className='mt-2 w-full'>
                <PasswordField 
                  requiredField={true}
                  inputLabel="Password" 
                  inputPlaceholder="Choose a secure password"
                  fieldId={`password`} 
                  hasError={validationErrors.password} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                  showPasswordMeter={true}
                />
              </div>
            </>}

            {activeStep === 2 && <>
              <div className='mt-2 w-full'>
                <TextField 
                  requiredField={true}
                  inputLabel="Business Name" 
                  inputPlaceholder="The name of your business"
                  fieldId={`business-name`} 
                  hasError={validationErrors.businessName} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                />
              </div>

              <p className='font-medium mt-5 text-ss-black'>
                Business Address/Contact Details
              </p>
              <p className='text-sm text-ss-dark-gray'>
                Please provide your business physical address below.
              </p>

              <div className='mt-2 w-full'>
                <TextField 
                  requiredField={true}
                  inputLabel="Address" 
                  inputPlaceholder="Where is ths business located"
                  fieldId={`business-address`} 
                  hasError={validationErrors.address} 
                  returnFieldValue={()=>{}}
                  preloadValue="" 
                  disabled={false} 
                />
              </div>
              <div className='flex items-start justify-between gap-x-5'>
                <div className='mt-2 w-full'>
                  <AutocompleteSelect 
                    selectOptions={[]}
                    requiredField={true}
                    inputLabel="State" 
                    inputPlaceholder="Select address state`"
                    fieldId={`business-address-state`} 
                    hasError={validationErrors.state} 
                    returnFieldValue={()=>{}}
                    preSelected={""}
                    preSelectedLabel={''} 
                    disabled={false} 
                  />
                </div>
                <div className='mt-2 w-full'>
                  <SelectField 
                    selectOptions={[]}
                    requiredField={true}
                    inputLabel="City" 
                    inputPlaceholder="Select address city"
                    fieldId={`business-address-city`} 
                    hasError={validationErrors.city} 
                    returnFieldValue={()=>{}}
                    preloadValue="" 
                    disabled={false} 
                  />
                </div>
              </div>
              {/* <h3 className='font-medium mt-5 text-ss-black'>
                Business subdomain
              </h3>
              <p className='text-sm text-ss-dark-gray'>
                Please provide your business physical address below.
              </p> */}

              <div className='mt-2 w-full'>
                {validatingSubdomain && <span className='absolute top-1.25 right-5'>
                  <InlinePreloader />    
                </span>}
                {subdomainValidated && <span className={`absolute top-0 right-0 p-1.75 rounded text-xs ${subdomainAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {subdomainAvailable ? 'Subdomain Available' : 'Subdomain Already taken'}
                </span>}
                <TextField 
                  inputLabel="Choose a subdomain" 
                  fieldId="store-subdomain" 
                  inputType="text" 
                  preloadValue={''}
                  inputPlaceholder={`eg: acme`}
                  hasError={validationErrors && validationErrors.subdomain} 
                  returnFieldValue={(value)=>{
                      validateSubdomain(value)
                  }}
                />
                <p className='text-[13px] text-gray-600 mt-1'>Choose a short, memorable subdomain for you store, this makes up your store url and that's how you can always access your store.<br/>
                <span className={`font-medium ${invalidSubdomain && 'text-red-600'}`}>Your subdomain should not contain any spaces or special characters.</span>
                </p>
              </div>
            </>}


            <div className='mt-5 pt-5 border-t border-gray-300 flex items-center justify-between gap-x-4 w-full'>
              <button onClick={()=>{setActiveStep(1)}} className='w-1/3 cursor-pointer flex items-center justify-center gap-x-2 text-ss-dark-gray text-sm'>
                <ArrowIcon className={`w-4 h-4 -rotate-180`} />
                Previous Step
              </button>
              <div className='w-full'>
                <FormButton 
                  buttonAction={()=>{completeStep1()}} 
                  buttonLabel={
                    activeStep === 1 ? <span className='flex items-center justify-center gap-x-2'>
                      Contiinue
                      <ArrowIcon className={`w-4 h-4`} />
                    </span> : 'Complete signup'
                  } 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup