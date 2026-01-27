import React from 'react'
import InlinePreloader from './InlinePreloader'

const ModalActionButton = ({buttonLabel, buttonAction, processing}) => {
  return (
    <button
        disabled={processing} 
        type="button"
        className="inline-flex justify-center px-5 py-4 text-xs font-medium bg-primary text-white border border-transparent rounded-[8px] hover:bg-opacity-60 transition duration-200 focus:outline-none"
        onClick={()=>{buttonAction()}}
    >
        {processing ? <InlinePreloader /> : buttonLabel}
    </button>
  )
}

export default ModalActionButton