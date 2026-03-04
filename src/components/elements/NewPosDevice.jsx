import React, { useState } from 'react'
import { ERROR, SET_SUCCESS } from '../../store/types'
import { authHeader, baseUrl } from '../../utils'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import TextField from './form/TextField'
import FormButton from './form/FormButton'

const NewPosDevice = ({close, reload}) => {
    const [device, setDevice] = useState({})

    const [processing, setProcessing] = useState(false)
    const dispatch = useDispatch()
    const [validationErrors, setValidationErrors] = useState({})

    const validateForm = () => {
        let errors = {}

        if (!device.deviceName || device.deviceName === '') {
            errors.deviceName = true
        }

        if(!device.provider || device.provider === '') {
            errors.provider = true
        }

        if(!device.serialNumber || device.serialNumber === '') {
            errors.serialNumber = true
        }

        setValidationErrors(errors)
        return errors
    }
    

    const saveDevice = async () => {
        try {
            if(Object.values(validateForm()).includes(true)) {
                dispatch({
                    type: ERROR,
                    error: {response: {data: {message: 'Form validation error: Please check highlighted fields'}}}
                })
                return
            }
            const headers = authHeader()

            const payload = device

            setProcessing(true)
            await axios.post(`${baseUrl}/settings/pos-devices`, payload, {headers})
            setProcessing(false)
            dispatch({
                type: SET_SUCCESS,
                payload: "New POS device saved successfully"
            })
            reload()
            close()
        } catch (error) {
            console.log('error saving pos: ', error)
            dispatch({
                type: ERROR,
                error
            })
            setProcessing(false)
        }
    }
  
  
    return (
        <div className='w-full'>
            <p className='text-sm text-gray-600'>Please provide the following details of the device.</p>
        
            <div className='my-2'>
                <TextField
                    inputLabel="Device name" 
                    fieldId={`device-name`} 
                    inputPlaceholder={`Give the device a name to identify it`}
                    inputType="text" 
                    preloadValue={device?.deviceName || ''}
                    hasError={validationErrors.deviceName} 
                    returnFieldValue={(value)=>{setDevice({...device, deviceName: value})}}
                />
            </div>
            <div className='my-2'>
                <TextField
                    inputLabel="Provider" 
                    fieldId={`device-provider`} 
                    inputPlaceholder={`The company/bank that provides the device`}
                    inputType="text" 
                    preloadValue={device?.provider || ''}
                    hasError={validationErrors.provider} 
                    returnFieldValue={(value)=>{setDevice({...device, provider: value})}}
                />
            </div>
            <div className='my-2'>
                <TextField
                    inputLabel="Serial number" 
                    fieldId={`device-serial-number`} 
                    inputPlaceholder={`Device serial number`}
                    inputType="text" 
                    preloadValue={device?.serialNumber || ''}
                    hasError={validationErrors.serialNumber} 
                    returnFieldValue={(value)=>{setDevice({...device, serialNumber: value})}}
                />
            </div>

            <div className='flex items-center gap-x-2 mt-6 pt-5 border-t border-gray-300'>
                <div className='w-max'>
                    <button onClick={()=>{close()}} className='bg-gray-100 hover:bg-gray-50 cursor-pointer transition duration-200 hover:text-gray-800 rounded-lg px-4 py-3 font-medium text-ss-dark-gray w-max text-sm'>Cancel</button>
                </div>
                <FormButton buttonLabel={`Save POS Device`} buttonAction={()=>{saveDevice()}} processing={processing} />
            </div>

        </div>
    )
}

export default NewPosDevice