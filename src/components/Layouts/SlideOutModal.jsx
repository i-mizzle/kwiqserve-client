import React from 'react'
import CloseIcon from '../elements/icons/CloseIcon'

const SlideOutModal = ({children, isOpen, closeFunction, title, subTitle}) => {
  return (
      <>
        {isOpen && <div className={`h-screen overflow-y-scroll w-full bg-[#00000020] fixed left-0 top-0 transform transition-all duration-200 border-black`} style={{zIndex: 995}}>

        </div>}
        <div className={`h-screen overflow-y-scroll w-full md:w-[400px] lg:w-[500px] xl:w-[550px] bg-white fixed right-0 top-0 transform transition-all duration-200  border-black shadow-lg shadow-black/10 ${ isOpen ? 'translate-x-0' : 'translate-x-full' }`} style={{zIndex: 999}}>
            <button className='absolute top-3 right-3 text-black p-[5px] rounded hover:text-gray-600 transition duration-200 hover:bg-gray-100' onClick={()=>{closeFunction()}} style={{zIndex: '997'}}>
                <CloseIcon className="w-5 h-5 text-black" />
            </button>

            <div className='py-3 w-full border-b border-gray-200 px-8 pt-4'>
                <h3 className='text-md font-[550]'>{title}</h3>
                <p className='text-sm'>{subTitle}</p>
            </div>

            <div className='px-8'>
              {children}
            </div>

        </div>
      </>
  )
}

export default SlideOutModal