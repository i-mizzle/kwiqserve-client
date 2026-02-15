import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'
import LogoutIcon from '../elements/icons/LogoutIcon'
import { hasPermissions } from '../../utils'
import Roadmap from '../../assets/images/icons/roadmap-icon.svg'

const UserMenu = ({businessDetails, userDetails, logOut}) => {
  return (
    <div className="w-max text-right">
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center w-full xl:px-4 py-2 font-family-bricolage-grotesque! font-medium text-gray-500 bg-opacity-20 hover:bg-opacity-30 focus:outline-none">
            <span className='hidden xl:inline-block text-sm'>{userDetails.name}</span>
            <span className='xl:hidden text-lg uppercase w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-ss-dark-blue'>{userDetails.name.split(' ')[0].charAt(0)}{userDetails.name.split(' ')[1].charAt(0)}</span>
            <ChevronDownIcon
                className="w-5 h-5 ml-2 -mr-1 text-gray-300 hover:text-gray-100"
                aria-hidden="true"
            />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-75 xl:w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className='xl:hidden w-full p-5 bg-gray-100'>
            <p className='text-sm'>{userDetails.name}</p>
            <p className='text-sm font-space-grotesk font-[550] mt-1.25'>{businessDetails?.name}</p>
          </div>
          <div className="px-4 py-2 ">
            {hasPermissions(['*', 'business.*', 'business.users.*', 'business.users.read']) && 
              <Menu.Item>
              {({ active }) => (
                <Link to="/user/users"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group xl:hidden flex rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  User Management
                </Link>
              )}
            </Menu.Item>
            }
            <Menu.Item>
              {({ active }) => (
                <Link to="/user/menu"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group xl:hidden flex rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  Menus
                </Link>
              )}
            </Menu.Item>
            
            <Menu.Item>
              {({ active }) => (
                <Link to="/user/orders"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group xl:hidden flex rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  Orders
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/user/transactions"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group flex xl:hidden rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  Payments/Transactions
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/user/profile"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group flex rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  Profile
                </Link>
              )}
            </Menu.Item>
            {hasPermissions(['*', 'store.*']) && <Menu.Item>
              {({ active }) => (
                <Link to="/user/store"
                className={`${
                  active ? 'bg-gray-200 text-white' : 'text-gray-900'
                } group flex rounded-md items-center w-full px-2 py-2 my-2 text-sm`}
              >
                  Business Details
                </Link>
              )}
            </Menu.Item>}

            <Menu.Item>
              {({ active }) => (
                <Link to={`/user/dashboard/getting-started`} 
                className={`${
                  active ? 'bg-gray-200 text-gray-800' : 'text-gray-900'
                } group flex rounded-md items-center gap-x-1.25 w-full px-2 py-2 my-2 text-sm`}
                >
                  <img src={Roadmap} alt='' className='w-5' />
                  Getting Started
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-200 text-gray-800' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 my-2 text-sm gap-x-2 font-family-outfit! font-medium`}
                  onClick={()=>{logOut()}}
                >
                    <LogoutIcon className="text-ss-dark-blue w-5 h-5" />
                    Log out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
)
}

export default UserMenu