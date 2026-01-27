import React, { useState } from 'react'

const RadioGroup = ({items, returnSelected, hasError, inputLabel, requiredField, inline, preSelectedIndex}) => {

    const [selectedOption, setSelectedOption] = useState(preSelectedIndex)

    const selectOption = (index, item) => {
        setSelectedOption(index)
        returnSelected(item)
    }

    return (
        <div className='max-w-[100%]'>
            <label 
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && requiredField === true && <span className='text-red-600'>*</span>} {inputLabel}
            </label>
            <div className={`w-full ${inline && 'flex gap-x-[20px] gap-y-1 items-center'}`}>
                {items.map((item, itemIndex)=>(
                <div onClick={()=>{selectOption(itemIndex, item)}} key={itemIndex} className={`w-full flex items-start border gap-x-2 rounded-[8px] my-2 p-[10px] bg-gray-100 cursor-pointer ${selectedOption === itemIndex ? 'bg-opacity-20 border-gray-600' : 'border-transparent'}`}>
                    <div className='w-[25px]'>
                        <button 
                                className={`flex items-center mt-[4px] justify-center rounded-full w-[20px] h-[20px] border-2 transition duration-200 text-white bg-white 
                                ${hasError ? 'border-red-600' : 'border-black'}`
                            } 
                            onClick={()=>{selectOption(itemIndex, item)}}
                        >
                            {selectedOption === itemIndex && <div className='w-[10px] h-[10px] transition duration-200 rounded-full bg-black'></div>}
                        </button>
                    </div>
                    
                    <div className={`text-sm cursor-pointer text-wrap ${hasError ? 'text-red-600' : 'text-black'}`}>
                        <p className={`${!item.description && 'mt-[3px]'}`}>{item.label}</p>
                        {item.description && item.description !== '' && !inline && <p className='text-xs mt-[5px] text-wrap'>{item.description}</p>}
                    </div>
                </div>
                ))
                }
            </div>
        </div>
    )
}

export default RadioGroup