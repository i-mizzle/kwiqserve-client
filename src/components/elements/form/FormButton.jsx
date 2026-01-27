import React from 'react'
import InlinePreloader from '../InlinePreloader'

const FormButton = ({buttonLabel, buttonAction, processing}) => {
  return (
    <button type='submit' disabled={processing} onClick={()=>{buttonAction()}} className='w-full px-[16px] py-[12px] rounded-[8px] bg-[#040f16] text-white border border-[#040f16] text-md transition duration-200 hover:bg-gray-200 hover:text-black text-sm flex items-center justify-center cursor-pointer'>{processing ? <InlinePreloader /> : buttonLabel }</button>
  )
}

export default FormButton