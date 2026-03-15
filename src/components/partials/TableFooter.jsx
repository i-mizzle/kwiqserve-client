import React from 'react'
import { businessDetails } from '../../utils'
import { Link } from 'react-router-dom'

const TableFooter = () => {
    const business = businessDetails() || {}
    return (
        <footer className='min-h-[20vh] bg-ss-black px-8 py-12 lg:px-24 xl:px-32 2xl:px-44'>
        
            <div className='w-full relative min-h-[20vh]'>
                <p className='text-sm text-stone-400 mb-2.5'>Contact us</p>
                <p className='text-sm text-white'>{business?.email || 'support@kwiqserve.com'}</p>
                <p className='text-sm text-white mb-5'>{business?.phone || '-'}</p>
                <p className='text-sm text-white'>{business?.address || '-'}</p>
                <p className='text-sm text-white'>{business?.city || '-'}</p>
                <Link to={`https://kwiqserve.com`} target='_blank' className='absolute bottom-0 left-0 flex items-end gap-x-2.5'>
                <p className='font-normal text-sm text-stone-200'>Running on <span className='font-family-bricolage-grotesque! font-semibold! text-ss-pale-blue'>KWIQSERVE</span></p>
                {/* <img alt='elevana' src={ElevanaLogo} className='w-[100px]' /> */}
                </Link>
            </div>
        </footer>
    )
}

export default TableFooter