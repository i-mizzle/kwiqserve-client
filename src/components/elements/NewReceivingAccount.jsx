import React, { useEffect, useState } from 'react'
import { ERROR, SET_SUCCESS } from '../../store/types'
import { authHeader, baseUrl } from '../../utils'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import TextField from './form/TextField'
import AutocompleteSelect from './form/AutocompleteSelect'
import Loader from './Loader'
import FormButton from './form/FormButton'
import InlinePreloader from './InlinePreloader'
import { Switch } from '@headlessui/react'

const NewReceivingAccount = ({close, reload}) => {
  const [loadingBanks, setLoadingBanks] = useState(true)
  const [banks, setBanks] = useState([])

  const [validatingAccount, setValidatingAccount] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [accountNumber, setAccountNumber] = useState(null)
  const [validatedAccount, setValidatedAccount] = useState(null)
  const [preferredForRemittance, setPreferredForRemittance] = useState(false)

  const [processing, setProcessing] = useState(false)
  const dispatch = useDispatch()
  const [validationErrors, setValidationErrors] = useState({})
  

  useEffect(() => {
    
    const fetchBanks = async () => {
      try {
        const headers = authHeader()

        setLoadingBanks(true)
        const response = await axios.get(`${baseUrl}/utilities/banks`, {headers})
        setBanks(response.data.data)
        setLoadingBanks(false)
      } catch (error) {
        console.log('error fetching user profile: ', error)
        dispatch({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    }

    fetchBanks()
    return () => {
      
    }
  }, [])


  useEffect(() => {
    const validateAccountNumber = async () => {
      try {
        const headers = authHeader()

        const payload = {
          bankCode: selectedBank.code, accountNumber
        }

        setValidatingAccount(true)
        const response = await axios.post(`${baseUrl}/utilities/validate-account`, payload, {headers})
        setValidatedAccount(response.data.data)
        setValidatingAccount(false)
      } catch (error) {
        console.log('error validating account: ', error)
        dispatch({
          type: ERROR,
          error
        })
        setValidatingAccount(false)
      }
    }
  
    if(selectedBank !== null && accountNumber && accountNumber.length === 10) {
      validateAccountNumber()
    }

    return () => {
      
    }
  }, [selectedBank, accountNumber])

  const saveAccount = async () => {
    try {
      const headers = authHeader()

      const payload = {
        bankCode: selectedBank.code, 
        accountNumber,
        accountName: validatedAccount ? validatedAccount?.account_name : '',
        preferredForRemittance,
        bankName: selectedBank.name
      }

      setProcessing(true)
      await axios.post(`${baseUrl}/settings/receiving-accounts`, payload, {headers})
      setProcessing(false)
      dispatch({
        type: SET_SUCCESS,
        payload: "New receiving account created successfully"
      })
      reload()
      close()
    } catch (error) {
      console.log('error saving account: ', error)
      dispatch({
        type: ERROR,
        error
      })
      setProcessing(false)
    }
  }
  
  
  return (
    <div className='w-full'>
      <p className='text-sm text-gray-600'>Please select a bank and provide your NUBAN Account number and bank below to create a receiving account for your business.</p>

      <div className='w-full flex items-start justify-between gap-x-5 mt-4 p-3 bg-gray-100'>
        <div>
          <p className='font-family-bricolage-grotesque text-gray-600 font-[550]'>Preferred for Remittance</p>
          <p className='text-[13px] text-gray-500'>Toggle this switch on if this is the account number preferred for remittances from Kwiqserve. If preferred, every payment made on this platform will be remitted to this account</p>
        </div>
        <div className='w-15'>
          <Switch
            checked={preferredForRemittance}
            onChange={()=>{setPreferredForRemittance(!preferredForRemittance)}}
            className={`${
                preferredForRemittance ? 'bg-ss-dark-blue' : 'bg-gray-200'
            } relative inline-flex items-center h-5 cursor-pointer rounded-full w-10 mt-2`}
            >
            <span
              className={`transform transition ease-in-out duration-200 ${
                preferredForRemittance ? 'translate-x-6 bg-ss-pale-blue' : 'translate-x-1 bg-white'
              } inline-block w-3 h-3 transform bg-white rounded-full`}
            />
          </Switch>
        </div>
      </div>    
      <div className='w-full mt-4'>
        {banks && banks.length > 0 ? <AutocompleteSelect 
          selectOptions={banks}
          requiredField={true}
          inputLabel="Bank" 
          inputPlaceholder="Select your bank"
          fieldId={`business-bank`} 
          hasError={validationErrors.state} 
          titleField={'name'}
          returnFieldValue={(value)=>{
            setSelectedBank(value)
          }}
          preSelected={""}
          preSelectedLabel={''} 
          disabled={false} 
        /> :
          <Loader />
        }
      </div>
      
      <div className='w-full mt-2'>
        <TextField 
          requiredField={true}
          inputLabel="Account number" 
          inputPlaceholder="Your NUBAN (10 Digit) account number"
          fieldId={`business-account-number`} 
          hasError={validationErrors.accountNumber} 
          returnFieldValue={(value)=>{setAccountNumber(value)}}
          preloadValue="" 
          disabled={false} 
        />
      </div>

      <div className='w-full mt-2'>
        {validatingAccount ? 
        <div className='flex items-center justify-center pt-2'>
          <InlinePreloader />
        </div>
        :
        <>
          {validatedAccount && <p className='capitalize font-semibold text-sm mt-3 rounded p-2 bg-ss-pale-blue'>{validatedAccount?.account_name?.toLowerCase()}</p>}
        </>
        }
      </div>

      <div className='flex items-center gap-x-2 mt-6 pt-5 border-t border-gray-300'>
        <div className='w-max'>
          <button onClick={()=>{close()}} className='bg-gray-100 hover:bg-gray-50 cursor-pointer transition duration-200 hover:text-gray-800 rounded-lg px-4 py-3 font-medium text-ss-dark-gray w-max text-sm'>Cancel</button>
        </div>
        <FormButton buttonLabel={`Save Receiving Account`} buttonAction={()=>{saveAccount()}} processing={processing} />
      </div>


    </div>
  )
}

export default NewReceivingAccount