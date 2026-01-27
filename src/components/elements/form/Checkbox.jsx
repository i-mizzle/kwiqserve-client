import React from 'react'
import CheckIcon from '../icons/CheckIcon'
import PropTypes from 'prop-types';

const Checkbox = ({CheckboxLabel, checkboxToggleFunction, isChecked, hasError}) => {
  return (
    <div className='w-full flex items-start gap-x-2'>
      <div className='w-[25px] mt-[2px]'>

        <button 
            className={`flex items-center justify-center w-[20px] h-[20px] border rounded transition duration-200 text-white 
            ${isChecked ? 'bg-black border-black' : 'bg-transparent border-gray-500'}
            ${hasError ? 'border-red-600' : 'border-gray-500'}`
          } 
          onClick={checkboxToggleFunction}
        >
            {isChecked && <CheckIcon className="w-5 h-5 text-white" />}
        </button>
      </div>
      <p className={`text-sm mt-[2px] ${hasError ? 'text-red-600' : 'text-gray-700'}`}>
        {CheckboxLabel}
      </p>
    </div>
  )
}

Checkbox.propTypes = {
  CheckboxLabel: PropTypes.any.isRequired,
  hasError: PropTypes.bool,
  isChecked: PropTypes.bool,
  checkboxToggleFunction: PropTypes.func.isRequired
};

export default Checkbox