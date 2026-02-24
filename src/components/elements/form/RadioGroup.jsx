import React, { useState } from 'react'

const RadioGroup = ({items, returnSelected, hasError, disabled, inputLabel, requiredField, inline, preSelectedIndex}) => {

    const [selectedOption, setSelectedOption] = useState(preSelectedIndex)

    const selectOption = (index, item) => {
        if(disabled) return
        setSelectedOption(index)
        returnSelected(item)
    }

    return (
        <div className='max-w-full'>
            <label 
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && requiredField === true && <span className='text-red-600'>*</span>} {inputLabel}
            </label>
            <div className={`w-full ${inline && 'flex gap-x-5 gap-y-1 items-center'}`}>
                {items.map((item, itemIndex)=>(
                <div onClick={()=>{selectOption(itemIndex, item)}} key={itemIndex} className={`w-full flex items-start border gap-x-2 rounded-lg my-2 p-2.5 bg-gray-100 cursor-pointer ${selectedOption === itemIndex ? 'bg-opacity-20 border-gray-600' : 'border-transparent'}`}>
                    <div className='w-6.25'>
                        <button 
                                className={`flex items-center mt-1 justify-center rounded-full w-5 h-5 border-2 transition duration-200 text-white bg-white 
                                ${hasError ? 'border-red-600' : 'border-black'}`
                            } 
                            onClick={()=>{selectOption(itemIndex, item)}}
                        >
                            {selectedOption === itemIndex && <div className='w-2.5 h-2.5 transition duration-200 rounded-full bg-ss-black'></div>}
                        </button>
                    </div>
                    
                    <div className={`text-sm cursor-pointer text-wrap ${hasError ? 'text-red-600' : 'text-ss-black'}`}>
                        <p className={`${!item.description && 'mt-0.75'}`}>{item.label}</p>
                        {item.description && item.description !== '' && !inline && <p className='text-xs mt-1.25 text-wrap'>{item.description}</p>}
                    </div>
                </div>
                ))
                }
            </div>
        </div>
    )
}

export default RadioGroup