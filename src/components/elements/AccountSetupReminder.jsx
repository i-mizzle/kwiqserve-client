import React from 'react'
import { Link } from 'react-router-dom'
import ArrowNarrowRight from './icons/ArrowNarrowRight'

const AccountSetupReminder = () => {
  return (
    <div className='w-full'>
        <h1 className='text-4xl font-semibold text-ss-dark-blue font-family-bricolage-grotesque'>Finish setting up your business</h1>
        <p className='text-ss-dark-gray text-sm my-3'>Let's take a moment to finish adding important details required for business.</p>
        <p className='text-ss-dark-gray text-sm my-3'>You can do this from business settings <span className='font-semibold text-ss-black'>(click on your name at the top right, then "Profile & Settings" then click "Business settings" in the sidebar)</span> or use any of the shortcuts below.</p>

        <div className='w-full rounded pb-4 border-b border-ss-light-gray mb-4 mt-8'>
            <h3 className='font-family-bricolage-grotesque font-medium text-md text-ss-dark-blue mb-1'>Remittance Account</h3>
            <p className='text-ss-dark-gray text-sm'>Set up a business account where every payment made on this platform will be remitted to.</p>
            <Link to={`/business/settings/business-settings?addRemittance=true`} className='flex items-center mt-1 gap-x-2 text-sm font-medium text-blue-700'>
                Setup Remittance Account
                <ArrowNarrowRight className={`w-5 h-5`} />
            </Link>
        </div>

        <div className='w-full rounded mb-4'>
            <h3 className='font-family-bricolage-grotesque font-medium text-md text-ss-dark-blue mb-1'>POS Devices</h3>
            <p className='text-ss-dark-gray text-sm'>Set up POS devices that your cashiers can use to receive payments from your customers.</p>
            <Link to={`/business/settings/business-settings?addPOS=true`} className='flex items-center mt-1 gap-x-2 text-sm font-medium text-blue-700'>
                Setup a POS Device
                <ArrowNarrowRight className={`w-5 h-5`} />
            </Link>
        </div>
    </div>
  )
}

export default AccountSetupReminder