import React from 'react'
import { NavLink } from 'react-router-dom'
import PieChartIcon from './icons/PieChartIcon'
import { hasPermissions } from '../../utils'
import ProductsIcon from '../elements/icons/ProductsIcon'
import StoreIcon from '../elements/icons/StoreIcon.jsx'
import SettingsIcon from './icons/SettingsIcon'
import PlusIcon from './icons/PlusIcon'
import BagIcon from './icons/BagIcon.jsx'
import SquaresStackedIcon from './icons/SquaresStackedIcon.jsx'

const MobileFooter = () => {
  return (
    <div className='flex items-center justify-between gap-x-5'>
        <div className='flex flex-col items-center justify-center'>
            <NavLink activeclassname="active" to="/business/dashboard" className="text-xs mb-1 p-2 rounded-lg bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="dashboard">
                <div className='relative w-full'>
                    <PieChartIcon className="w-6 h- icon" />
                </div>
            </NavLink>
            <p className='text-gray-600 text-xs text-center font-medium'>Dashboard</p>
        </div>

        {hasPermissions(['*', 'business.*', 'items.*', 'items.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/business/items" className="text-xs mb-1 p-2 rounded-lg bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="tickets">
                    <div className='relative w-full'>
                        <ProductsIcon className="w-6 h-6 icon" />
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-medium'>Items</p>
            </div>
        }

        {hasPermissions(['*', 'business.*', 'items.*', 'items.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/business/orders" className="bg-ss-dark-blue text-xs mb-3 w-16.25 h-16.25 flex items-center justify-center rounded-full -mt-7.5 w-inherit shadow-lg shadow-ss-dark-blue/10 border-2 border-white">
                    <BagIcon className="w-6 h-6  text-white" />
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-medium'>Orders</p>
            </div>
        }

        {hasPermissions(['*', 'business.*', 'inventory.*', 'inventory.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/business/inventory" className="text-xs mb-1 p-2 rounded-lg bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="events">
                    <div className='relative w-full'>
                        <SquaresStackedIcon className="w-6 h-6 icon" />
                        {/* {activeToolTip === 'inventory' && <div className='absolute -top-[14px] -right-[220px] bg-gray-700 p-4 z-50 w-[200px]'>
                            <p className='text-white'>Inventory</p>
                        </div>} */}
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-medium'>Tables</p>
            </div>
        }

        {hasPermissions(['*', 'business.*', 'stores.*', 'stores.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/business/settings" className="text-xs mb-1 p-2 rounded-lg bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="settings">
                    <div className='relative w-full'>
                        <SettingsIcon className="w-6 h-6 icon" />
                        {/* {activeToolTip === 'settings' && <div className='absolute -top-[14px] -right-[220px] bg-gray-700 p-4 z-50 w-[200px]'>
                            <p className='text-white'>Settings</p>
                        </div>} */}
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-medium'>Settings</p>
            </div>
        }
    </div>
  )
}

export default MobileFooter