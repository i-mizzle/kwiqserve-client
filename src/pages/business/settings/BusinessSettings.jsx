import React, { useEffect, useState } from 'react'
import Loader from '../../../components/elements/Loader'
import { authHeader, baseUrl, parseNigerianStates, stateCities } from '../../../utils'
import axios from 'axios'
import PlusIcon from '../../../components/elements/icons/PlusIcon'
import NewReceivingAccount from '../../../components/elements/NewReceivingAccount'
import ModalDialog from '../../../components/Layouts/ModalDialog'
import TextField from '../../../components/elements/form/TextField'
import FormButton from '../../../components/elements/form/FormButton'
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect'
import SelectField from '../../../components/elements/form/SelectField'
import { useDispatch } from 'react-redux'
import { ERROR } from '../../../store/types'
import RadioGroup from '../../../components/elements/form/RadioGroup'
import EmptyState from '../../../components/elements/EmptyState'

const BusinessSettings = () => {
  const [loading, setLoading] = useState(true)
  const [businessPayload, setBusinessPayload] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch = useDispatch()
  const [businessSettings, setBusinessSettings] = useState(null)
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const headers = authHeader()

        setLoading(true)
        const response = await axios.get(`${baseUrl}/business`, {headers})
        setBusinessPayload(response.data.data)
        setCityOptions(stateCities(response.data.data.state))
        fetchBusinessSettings()
      } catch (error) {
        console.log('error fetching user profile: ', error)
        dispatch({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    }

    const fetchBusinessSettings = async () => {
      try {
        const headers = authHeader()

        setLoading(true)
        const response = await axios.get(`${baseUrl}/settings?expand=receivingAccounts.account`, {headers})
        setBusinessSettings(response.data.data)
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

    fetchBusinessDetails()
  
    return () => {
      
    }
  }, [reload, dispatch])
  
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [cityOptions, setCityOptions] = useState([])
  
  const remittanceOptions = [
    {
      label: 'Next working day',
      value: 'next-working-day',
      description: 'Payments made to your business through this platform will be sent to your preferred remittance account number on the next working day.'
    },
    {
      label: 'Instant Settlement',
      value: 'instant',
      description: 'Every payment made to your business through this platform will be settled to your preferred remittance account instantly. (Coming soon)'
    },
  ]
  return (
    <>
      <div className="w-full">
        {loading ? 
          <Loader />
        : 
        <>
          <div className='w-8/12 pb-10 border-b border-gray-300 mb-5'>
            <h1 className='text-3xl font-bold text-ss-dark-gray'>Business Settings</h1>
            <p className='text-gray-500 text-sm'>Please see details of your business below. You can change any details you need to and click on "Update Business Details" to save updates.</p>
          
          
            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="phone-number"
                inputLabel="Business name" 
                preloadValue={businessPayload.name || ''}
                inputPlaceholder={`The name of your business`}
                hasError={validationErrors.name} 
                returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, ...{name: value}})}}
              />
            </div>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="subdomain"
                inputLabel="Business Subdomain" 
                preloadValue={businessPayload.subdomain || ''}
                inputPlaceholder={`Your selected business subdomain`}
                hasError={validationErrors.subdomain} 
                returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, ...{name: value}})}}
              />
            </div>

            <div className='flex w-full item-start justify-between gap-x-5'>
              <div className='w-full mt-4'>
                <TextField
                  inputType="text" 
                  fieldId="business-email"
                  inputLabel="Business Email" 
                  preloadValue={businessPayload.email || ''}
                  inputPlaceholder={`Your business contact email`}
                  hasError={validationErrors.email} 
                  returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, ...{email: value}})}}
                />
              </div>

              <div className='w-full mt-4'>
                <TextField
                  inputType="text" 
                  fieldId="business phone"
                  inputLabel="Business Phone Number" 
                  preloadValue={businessPayload.phone || ''}
                  inputPlaceholder={`Your business phone number`}
                  hasError={validationErrors.phone} 
                  returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, ...{phone: value}})}}
                />
              </div>
            </div>

            <div className='w-full mt-4'>
              <TextField
                inputType="text" 
                fieldId="address"
                inputLabel="Business address" 
                preloadValue={businessPayload.address || ''}
                inputPlaceholder={`Your business address`}
                hasError={validationErrors.address} 
                returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, ...{address: value}})}}
              />
            </div>

            <div className='flex items-start justify-between gap-x-5'>
              <div className='mt-2 w-full'>
                <AutocompleteSelect 
                  selectOptions={parseNigerianStates()}
                  requiredField={true}
                  inputLabel="State" 
                  inputPlaceholder="Select address state"
                  fieldId={`business-address-state`} 
                  hasError={validationErrors.state} 
                  titleField={'label'}
                  returnFieldValue={(value)=>{
                    setBusinessPayload({...businessPayload, state: value.label})
                    setCityOptions(stateCities(value.label))
                  }}
                  preSelected={businessPayload.state}
                  preSelectedLabel={'label'} 
                  disabled={false} 
                />
              </div>
              <div className='mt-2 w-full'>
                {cityOptions.length > 0 ? <SelectField 
                  selectOptions={cityOptions}
                  requiredField={true}
                  inputLabel="City" 
                  inputPlaceholder="Select address city"
                  fieldId={`business-address-city`} 
                  hasError={validationErrors.city} 
                  returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, city: value})}}
                  // preloadValue={businessPayload.city || '' } 
                  preSelected={businessPayload.city || ''}
                  disabled={false} 
                  titleField={''}
                /> :
                <TextField 
                  requiredField={true}
                  inputLabel="City" 
                  inputPlaceholder="Address city"
                  fieldId={`business-address-city`} 
                  hasError={validationErrors.city} 
                  returnFieldValue={(value)=>{setBusinessPayload({...businessPayload, city: value})}}
                  preloadValue="" 
                  disabled={false} 
                />
                }
              </div>
            </div>

            <div className='w-max mt-4'>
              <FormButton buttonLabel={`Update Business Details`} buttonAction={()=>{}} />
            </div>
          </div>

          <div className='w-8/12 pb-10 border-b border-gray-300 mb-5'>

            <h1 className='text-xl font-bold text-ss-dark-gray'>Settlement/Remittance Preferences</h1>
            <p className='text-gray-500 text-sm mb-3'>How soon do you want remittances made? Select an option below and click "Save Settlement Preferences"</p>

            <RadioGroup
              items={remittanceOptions}
              returnSelected={(selected)=>{setActiveDeliveryOption(selected.value)}}
              inline={false}
              preSelectedIndex={0}
              hasError={false}
              disabled={true}
            />

            <div className='w-max mt-4'>
              <FormButton buttonLabel={`Save Settlement Preferences`} disabled={true} buttonAction={()=>{}} />
            </div>
            
          </div>

          <div className='w-10/12'>
            <h1 className='text-xl font-bold text-ss-dark-gray'>Collection Accounts</h1>
            <p className='text-gray-500 text-sm'>Below are accounts for business collections. you can create a new account by clicking on "Add new account" below.</p>

            <button onClick={()=>{setCreatingAccount(true)}} className='flex gap-x-2 items-center justify-center mt-5 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 w-max hover:bg-ss-black text-sm font-[550]'>
              <PlusIcon className={`h-5 w-5`} />
              Add a new account
            </button>

            <div className='mt-5'>
              {businessSettings?.receivingAccounts?.length > 0 ?
              
                <div className='grid grid-cols-2 gap-3'>
                  {businessSettings?.receivingAccounts?.map((account, accountIndex) => (
                    <div key={accountIndex} className='relative p-5 rounded bg-gray-50'>
                      {account.preferredForRemittance && <span className='text-xs absolute top-3 right-3 text-green-600 bg-green-600/10 rounded px-2 py-1'>Preferred for Remittance</span>}
                      <h3 className='font-semibold text-ss-black text-lg mb-2 capitalize'>{account.account.accountName.toLowerCase()}</h3>
                      <div className='flex items-center gap-x-1'>
                        <p className='text-sm text-gray-600'>{account.account.accountNumber}</p>
                        <span className='w-1 h-1 rounded-full bg-ss-dark-gray' />
                        <p className='text-sm text-gray-600'>{account.account.bankName}</p>
                      </div>
                    </div>
                  ))}
                </div>
                :
                <EmptyState 
                  emptyStateTitle={`No accounts found`}
                  emptyStateText={`No receiving accounts created for your business yet, click on "Add new account" above to add one`} 
                /> 
              }
            </div>
            
          </div>
        </>}
      </div>

      <ModalDialog
        shown={creatingAccount} 
        closeFunction={()=>{setCreatingAccount(false)}} 
        dialogTitle='Create a New Receiving Account'
        // dialogIntro={`Create a category for store or sale items`}
        maxWidthClass='max-w-lg'
      >
        <NewReceivingAccount close={()=>{setCreatingAccount(false)}} reload={()=>{setReload(reload+1)}} />
      </ModalDialog>
    </>
  )
}

export default BusinessSettings