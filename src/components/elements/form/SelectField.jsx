import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Hook that alerts clicks outside of the passed ref
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useOutsideAlerter(ref, closeFunction) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeFunction();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeFunction, ref]);
}

const SelectField = ({
  disabled,
  selectOptions,
  inputLabel,
  titleField,
  hasError,
  returnFieldValue,
  inputPlaceholder,
  preSelectedIndex,
  preSelected,
  preSelectedLabel,
  requiredField,
  position='top-[90px]'
}) => {
  const [activeValue, setActiveValue] = useState('');
  const [visibleOptions, setVisibleOptions] = useState(selectOptions);
  const [optionsOpen, setOptionsOpen] = useState(false);

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

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, closeOptions);

  return (
    <div ref={wrapperRef} className='relative w-full'>
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
              placeholder={inputPlaceholder}
              readOnly
              // onBlur={()=>{closeOptions()}} 
              onChange={(e)=>{}}
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
            <div className='relative'>
                {visibleOptions.map((option, optionIndex) => (
                    <button key={optionIndex} 
                      className={
                        `relative w-full px-3 py-2 my-1 flex flex-row text-left items-center gap-x-3 text-sm transition duration-200 hover:bg-gray-100 text-gray-500}`
                      } 
                      onClick={()=>{
                        changeActiveValue(titleField !== '' ? option[titleField] : option, option)}
                      }
                    >                               
                        {titleField !== '' ? option[titleField] : option}
                    </button>
                ))}
                
            </div>
        </div>
      }

            
    </div>
  );
};

SelectField.propTypes = {
  selectOptions: PropTypes.array.isRequired,
  inputLabel: PropTypes.string.isRequired,
  titleField: PropTypes.string.isRequired,
  displayImage: PropTypes.bool.isRequired,
  imageField: PropTypes.string,
  fieldId: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  returnFieldValue: PropTypes.func.isRequired,
  preSelectedIndex: PropTypes.any,
  preSelected: PropTypes.any,
  preSelectedLabel: PropTypes.string,
  requiredField: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SelectField;
