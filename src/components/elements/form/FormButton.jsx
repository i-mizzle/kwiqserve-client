import React from 'react'
import InlinePreloader from '../InlinePreloader'

const FormButton = ({buttonLabel, buttonAction, disabled, processing}) => {
  return (
    <button type='submit' disabled={processing || disabled} onClick={()=>{buttonAction()}} className='w-full px-4 py-3 rounded-lg bg-ss-black text-white border border-ss-black text-md transition duration-200 disabled:cursor-not-allowed hover:bg-ss-dark-gray text-sm flex items-center justify-center cursor-pointer'>{processing ? <InlinePreloader /> : buttonLabel }</button>
  )
}

export default FormButton