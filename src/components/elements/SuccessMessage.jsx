import React from 'react'

const SuccessMessage = ({message, dismissHandler}) => {

    setTimeout(() => {
        dismissHandler()
    }, 7000);

    return (
        <div className='fixed top-5 left-[35%] mt-5 text-xs font-sofia-pro rounded px-3 py-2 bg-green-400 text-black capitalize transition duration-200 flex justify-between items-center shadow-lg w-[30%]' style={{zIndex: 999}}>   
            {message}
            <button onClick={dismissHandler} className='text-secondary hover:text-opacity-60 p-2 transition duration-200'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export default SuccessMessage
