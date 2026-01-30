import React from 'react'
import Logo from '../elements/Logo'
import ArrowIcon from '../elements/icons/ArrowIcon'

const LandingHeader = () => {
  return (
    <header className='px-8 xl:px-32 2xl:px-44 w-full py-4 absolute bg-transparent flex items-center justify-between'>
      <div className='w-max'>
        <Logo />
        <button className='flex text-ss-black text-xs item-center justify-between py-3 gap-x-4 font-medium mt-1 border-t border-gray-400'>
          support@scanserve.cloud
          <ArrowIcon className={`w-4 h-4`} />
        </button>
      </div>

      <div className='flex flex-row-reverse items-center gap-x-3'>
        <button className='px-4 py-3 rounded-lg bg-ss-dark-blue border-2 border-ss-black text-ss-white font-medium text-[13px] transition duration-200 hover:bg-ss-black'>Click here to signup</button>
        <p className='text-sm text-ss-dark-gray'>Don't have an account?</p>
      </div>
    </header>
  )
}

export default LandingHeader