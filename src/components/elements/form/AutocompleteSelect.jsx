import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import PlusIcon from '../icons/PlusIcon';
import InlinePreloader from '../InlinePreloader';
import CheckIcon from '../icons/CheckIcon';
import { useOutsideAlerter } from './SelectField';

const AutocompleteSelect = ({
    selectOptions, 
    inputLabel, 
    placeholderText,
    displayImage, 
    imageField, 
    bgImage,
    titleField, 
    preSelected, 
    preSelectedLabel,
    hasError, 
    returnFieldValue,
    includeButton,
    buttonLabel,
    buttonAction,
    disabled,
    requiredField,
    conditionalItemStyling,
    position='top-[90px]'
}) => {
    const [activeValue, setActiveValue] = useState(preSelected[preSelectedLabel] || '')
    const [visibleOptions, setVisibleOptions] = useState(selectOptions)
    const [optionsOpen, setOptionsOpen] = useState(false)

    useEffect(() => {
        const preSelect = () => {
            if(!preSelected || preSelected === undefined) {
                return
            }
    
            selectOptions?.forEach((option) => {
                if (preSelectedLabel && preSelectedLabel !== '' && option[preSelectedLabel] && option[preSelectedLabel] === preSelected) {
                    setActiveValue(option[titleField])
                }

                if ((!preSelectedLabel || preSelectedLabel === '') && option === preSelected) {
                    setActiveValue(option)
                }
            })
        }
        preSelect()
    
    }, [preSelected, preSelectedLabel, selectOptions, titleField])


    const openOptions = () => {
        if(disabled) {return}
        setOptionsOpen(true)
    }

    const closeOptions = () => {
        setOptionsOpen(false)
    }

    const filterOptions = (term) => {
        const filtered = selectOptions.filter((option)=> {
            if (titleField && titleField !== '') {
                return option[titleField].toLowerCase().includes(term.toLowerCase())
            } else {
                return option.toLowerCase().includes(term.toLowerCase())
            }
        })
        setActiveValue(term)
        setVisibleOptions(filtered)
    }

    const changeActiveValue = (value, object) => {
        setActiveValue(value)
        returnFieldValue(object)
        closeOptions()
    }

    const [conditionalItemProcessing, setConditionalItemProcessing] = useState('');
    const fireConditionalAction = async (option) => {
        setConditionalItemProcessing(option[conditionalItemStyling.itemIdentifier])

        await conditionalItemStyling.action(option)
        setTimeout(() => {
            setConditionalItemProcessing('')        
        }, 3000);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeOptions);

    return (
        // <div className='w-full relative'>
        <div  ref={wrapperRef} className='relative w-full'>
            <div 
                // className={`w-full cursor-text border rounded py-4 pl-4 pr-2 relative z-0 flex items-center justify-between 
                // ${disabled ? 'border-gray-300' : ''} 
                // ${isFocused || activeValue !== '' ? 'border-black bg-white' : 'border-black bg-gray-100'} 
                // ${hasError && 'border-red-600'}`} 
                // onClick={()=>{focusField()}} 
                // onBlur={()=>{setIsFocused(false)}}
            >
                {/* ${isFocused || activeValue !== '' ? '-translate-y-8 bg-white' : 'translate-y-0 bg-gray-100'}   */}
                {inputLabel && inputLabel !== '' && <label 
                className={`text-sm lg:text-md cursor-text block bg-transparent relative py-1 mb-1 transition duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
                    {requiredField && requiredField === true && <span className='text-red-600'>*</span>} {inputLabel}
                </label>}
                
                {/* Text input */}
                <input 
                    type="text" 
                    className={`rounded py-3 px-3 block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 hover:bg-gray-50 border bg-gray-100  transition duration-200 focus:bg-white text-sm font-outfit placeholder:font-outfit  ${hasError ? 'border-red-600' : 'border-gray-100'}`}
                    onClick={()=>{openOptions()}}  
                    onFocus={()=>{openOptions()}}  
                    placeholder={placeholderText}
                    readOnly={disabled}
                    // onBlur={()=>{closeOptions()}} 
                    onChange={(e)=>{filterOptions(e.target.value)}}
                    value={activeValue} 
                />
                {/* <img alt="" src={ChevronDown} className='absolute w-5 top-3 right-3' /> */}
                {/* <button onClick={()=>{openOptions()}}>
                    <TwoWayChevronIcon className="w-5 h-5 text-black" />
                </button> */}
            </div>
            {/* Options */}
            {optionsOpen &&
                <div className={`absolute shadow-lg border border-gray-200 rounded w-full left-0 py-1 bg-white overflow-y-scroll pt-1 z-50 ${position}`} 
                style={{
                    maxHeight: '350px', 
                    paddingBottom:'5px'
                }}>
                    {/* <button className='absolute top-3 right-3 text-gray-600 hover:text-gray-400 transition duration-200' onClick={()=>{closeOptions()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button> */}
                    <div className='relative'>
                        {visibleOptions.map((option, optionIndex) => (
                            <button key={optionIndex} 
                                className={
                                    `relative w-full px-3 py-2 my-1 flex flex-row text-left items-center gap-x-3 text-sm transition duration-200 hover:bg-gray-100 
                                    ${conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] == true 
                                        ? conditionalItemStyling.classes 
                                        : 'text-gray-500'}`
                                } 
                                
                                onClick={()=>{
                                    if(conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] === true) {
                                        fireConditionalAction(option)
                                    } else {
                                        changeActiveValue(titleField !== '' ? option[titleField] : option, option)}
                                    }
                                }
                            >
                                {displayImage && !bgImage &&
                                    <img alt="" src={option[imageField]} className='w-[30px]' />
                                }

                                {displayImage && bgImage &&
                                    <div className='w-[35px] h-[35px] rounded-full' style={{
                                        backgroundImage: `url(${ option[imageField]})`, backgroundSize: 'cover', backgroundPosition: 'center'
                                    }} />
                                }
                                {/* <img alt="" src={option[imageField]} className='w-[30px]' /> */}

                                {conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey]}

                                
                                {titleField !== '' ? option[titleField] : option}
                                
                                {conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] === true && !conditionalItemStyling.actionProcessed && conditionalItemStyling.includeButton &&
                                    <>
                                        {conditionalItemProcessing === option[conditionalItemStyling.itemIdentifier] ?
                                            <span className='absolute right-12 w-5'>
                                                <InlinePreloader />
                                            </span>
                                            :
                                            <span className={`${conditionalItemStyling.buttonClasses}`}>
                                                {conditionalItemStyling.itemProcessed === option[conditionalItemStyling.itemIdentifier] ?
                                                    <CheckIcon className={`w-4 h-4 text-green-500`} />
                                                    :
                                                    conditionalItemStyling.buttonLabel
                                                }
                                            </span>
                                        }
                                    </>
                                }
                            </button>
                        ))}
                        {/* Footer Buttone */}
                        {includeButton && includeButton === true &&
                            <button className='absolute -bottom-[55px] left-[10%] right-auto w-[80%] px-3 py-4 text-center text-sm bg-black font-tomato transition duration-200 hover:bg-gray-800 text-white flex items-center justify-center gap-x-1' onClick={()=>{buttonAction()}}>
                                <PlusIcon className={`w-4 h-4`}/>
                                {buttonLabel}
                            </button>
                        }
                    </div>
                </div>
            }

            
        </div>
    )
}

AutocompleteSelect.propTypes = {
    selectOptions: PropTypes.array.isRequired,
    inputLabel: PropTypes.string.isRequired,
    titleField: PropTypes.string.isRequired,
    displayImage: PropTypes.bool.isRequired,
    imageField: PropTypes.string,
    fieldId: PropTypes.string.isRequired,
    hasError: PropTypes.bool,
    includeButton: PropTypes.bool,
    buttonLabel: PropTypes.string,
    buttonAction: PropTypes.func,
    returnFieldValue: PropTypes.func.isRequired
};

export default AutocompleteSelect
