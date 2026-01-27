import React, { useState } from 'react'

const TextareaField = ({inputLabel, fieldId, maxLength, requiredField, hasError, returnFieldValue, preloadValue, disabled, inputPlaceholder}) => {

    const [ fieldValue, setFieldValue ] = useState(preloadValue)

    const setValue = (value) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div>
            {/* {fieldValue} */}
            <label 
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && requiredField === true && <span className='text-red-600'>*</span>}   {inputLabel}
            </label>
            <textarea 
                id={fieldId} 
                className={`rounded py-3 px-3 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 hover:bg-gray-50 border bg-gray-100  transition duration-200 focus:bg-white font-outfit placeholder:font-outfit  ${hasError ? 'border-red-600' : 'border-gray-100'} min-h-[120px]`}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
                maxLength={maxLength}
                placeholder={inputPlaceholder}
                />
        </div>
    )
}

export default TextareaField