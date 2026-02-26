import React from 'react'
import { NavLink } from 'react-router-dom'
import PieChartIcon from './icons/PieChartIcon'
import { hasPermissions } from '../../utils'
import ProductsIcon from '../elements/icons/ProductsIcon'
import StoreIcon from '../elements/icons/StoreIcon'
import SettingsIcon from './icons/SettingsIcon'
import PlusIcon from './icons/PlusIcon'

const MobileFooter = () => {
  return (
    <div className='flex items-center justify-between gap-x-[20px]'>
        <div className='flex flex-col items-center justify-center'>
            <NavLink activeclassname="active" to="/user/dashboard" className="text-xs mb-1 p-2 rounded-[8px] bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="dashboard">
                <div className='relative w-full'>
                    <PieChartIcon className="w-6 h- icon" />
                </div>
            </NavLink>
            <p className='text-gray-600 text-xs text-center font-[500]'>Dashboard</p>
        </div>

        {hasPermissions(['*', 'store.*', 'items.*', 'items.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/user/items" className="text-xs mb-1 p-2 rounded-[8px] bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="tickets">
                    <div className='relative w-full'>
                        <ProductsIcon className="w-6 h-6 icon" />
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-[500]'>Items</p>
            </div>
        }

        {hasPermissions(['*', 'store.*', 'items.*', 'items.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/user/orders/new-order" className="bg-green-500 text-xs mb-3 w-[65px] h-[65px] flex items-center justify-center rounded-full -mt-[30px] w-inherit shadow-lg shadow-green-500/10 border-2 border-white">
                    <PlusIcon className="w-8 h-8  text-white" />
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-[500]'>New Order</p>
            </div>
        }

        {hasPermissions(['*', 'store.*', 'inventory.*', 'inventory.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/user/inventory" className="text-xs mb-1 p-2 rounded-[8px] bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="events">
                    <div className='relative w-full'>
                        <StoreIcon className="w-6 h-6 icon" />
                        {/* {activeToolTip === 'inventory' && <div className='absolute -top-[14px] -right-[220px] bg-gray-700 p-4 z-50 w-[200px]'>
                            <p className='text-white'>Inventory</p>
                        </div>} */}
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-[500]'>Inventory</p>
            </div>
        }

        {hasPermissions(['*', 'store.*', 'stores.*', 'stores.read']) && 
            <div className='flex flex-col items-center justify-center'>
                <NavLink activeclassname="active" to="/user/settings" className="text-xs mb-1 p-2 rounded-[8px] bg-opacity-10 w-inherit flex-row gap-x-4 items-center text-opacity-70 nav-button" data-tip data-for="settings">
                    <div className='relative w-full'>
                        <SettingsIcon className="w-6 h-6 icon" />
                        {/* {activeToolTip === 'settings' && <div className='absolute -top-[14px] -right-[220px] bg-gray-700 p-4 z-50 w-[200px]'>
                            <p className='text-white'>Settings</p>
                        </div>} */}
                    </div>
                </NavLink>
                <p className='text-gray-600 text-xs text-center font-[500]'>Settings</p>
            </div>
        }
    </div>
  )
}

export default MobileFooter