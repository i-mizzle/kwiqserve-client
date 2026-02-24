import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import AppLayout from './AppLayout'

const SettingsLayout = ({children}) => {
    const location = useLocation()
    return (
        <AppLayout>
            <div className='flex items-start gap-x-5 relative'>
                <div className='w-62.5 px-5 sticky top-15'>
                    <Link to={`/business/settings/profile`} className={`px-3 py-2 text-[15px] transition duration-200 font-medium font-family-bricolage-grotesque! text-md text-ss-black hover:text-ss-dark-blue! hover:bg-gray-50 rounded mb-1 w-full flex items-center justify-between ${location.pathname === `/business/settings/profile` ? 'font-bold bg-ss-pale-blue/50' : 'font-medium'}`}>
                        Profile 
                        {location.pathname === `/business/settings/profile` && <span className='w-1.5 h-1.5 rounded-full bg-ss-black' />}
                    </Link>
                    <Link to={`/business/settings/business-settings`} className={`px-3 py-2 text-[15px] transition duration-200 font-medium font-family-bricolage-grotesque! text-md text-ss-black hover:text-ss-dark-blue! hover:bg-gray-50 rounded mb-1 w-full flex items-center justify-between ${location.pathname === `/business/settings/business-settings` ? 'font-bold bg-ss-pale-blue/50' : 'font-medium'}`}>
                        Business Settings 
                        {location.pathname === `/business/settings/business-settings` && <span className='w-1.5 h-1.5 rounded-full bg-ss-black' />}
                    </Link>
                    <Link to={`/business/settings/users`} className={`px-3 py-2 text-[15px] transition duration-200 font-medium font-family-bricolage-grotesque! text-md text-ss-black hover:text-ss-dark-blue! hover:bg-gray-50 rounded mb-1 w-full flex items-center justify-between ${location.pathname.includes(`/business/settings/users`) ? 'font-bold bg-ss-pale-blue/50' : 'font-medium'}`}>
                        Users 
                        {location.pathname.includes(`/business/settings/users`) && <span className='w-1.5 h-1.5 rounded-full bg-ss-black' />}
                    </Link>
                    <Link to={`/business/settings/roles`} className={`px-3 py-2 text-[15px] transition duration-200 font-medium font-family-bricolage-grotesque! text-md text-ss-black hover:text-ss-dark-blue! hover:bg-gray-50 rounded mb-1 w-full flex items-center justify-between ${location.pathname === `/business/settings/roles` ? 'font-bold bg-ss-pale-blue/50' : 'font-medium'}`}>
                        System Roles 
                        {location.pathname === `/business/settings/roles` && <span className='w-1.5 h-1.5 rounded-full bg-ss-black' />}
                    </Link>
                </div>
                <main className='w-full'>
                    {children}
                </main>
            </div>
        </AppLayout>
    )
}

export default SettingsLayout