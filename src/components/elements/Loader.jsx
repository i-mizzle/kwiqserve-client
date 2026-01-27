import React from 'react'
import InlinePreloader from './InlinePreloader'

const Loader = () => {
  return (
    <div className='px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center rounded-lg mt-8'>
        <div className="w-6">
            <InlinePreloader />
        </div>
    </div>
  )
}

export default Loader