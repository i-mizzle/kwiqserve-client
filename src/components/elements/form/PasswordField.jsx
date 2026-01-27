import React, { useState } from 'react'
import EyeIcon from '../icons/EyeIcon'
import EyeOffIcon from '../icons/EyeOffIcon'

const PasswordField = ({
    requiredField,
    inputLabel, 
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    inputPlaceholder,
    maxLength,
}) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue)
    const [ hiddenInput, setHiddenInput ] = useState(true)
    // const id = generateCode(12)

    // const [fieldId, setFieldId] = useState(id)

    const toggleHiddenInput = (e) => {
        e.preventDefault()
        setHiddenInput(!hiddenInput)
    }

    const setValue = (value) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div className='relative'
        >
            <label 
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-2 block duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && requiredField === true && <span className='text-red-600'>*</span>}   {inputLabel}
            </label>

            <span className={`absolute z-40 cursor-pointer pt-2 top-[40px] right-4`} onClick={(e)=>{toggleHiddenInput(e)}}>
                {hiddenInput ?
                <EyeIcon className={`w-5 h-5 text-gray-600`} />
                :
                <EyeOffIcon className={`w-5 h-5 text-gray-600`} />}
            </span>

            <input 
                id={fieldId} 
                type={hiddenInput ? 'password' : "text"} 
                maxLength={maxLength}
                className={`rounded py-3 px-3 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 hover:bg-gray-50 border bg-gray-100  transition duration-200 focus:bg-white font-outfit placeholder:font-outfit  ${hasError ? 'border-red-600' : 'border-gray-100'}`} 
                placeholder={inputPlaceholder}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
            />

            

        </div>
    )
}
export default PasswordField