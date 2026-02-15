import React from 'react'
import { businessDetails } from '../../utils'
import { Link } from 'react-router-dom'

const TableFooter = () => {
    const business = businessDetails()
    return (
        <footer className='min-h-[20vh] bg-ss-black px-8 py-12 lg:px-24 xl:px-32 2xl:px-44'>
        
            <div className='w-full relative min-h-[30vh]'>
                <p className='text-sm text-stone-400 mb-2.5'>Contact us</p>
                <p className='text-sm text-white'>{business.email}</p>
                <p className='text-sm text-white mb-5'>{business.phone}</p>
                <p className='text-sm text-white'>{business.address}</p>
                <p className='text-sm text-white'>{business.city}</p>
                <Link to={`https://scanserve.cloud`} target='_blank' className='absolute bottom-0 right-5 flex items-end gap-x-2.5'>
                <p className='font-space-grotesk text-sm text-stone-200'>Running on SCANSERVE</p>
                {/* <img alt='elevana' src={ElevanaLogo} className='w-[100px]' /> */}
                </Link>
            </div>
        </footer>
    )
}

export default TableFooter