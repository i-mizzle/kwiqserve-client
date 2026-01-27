import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'


const DropdownMenu = ({buttonType, buttonText, buttonIcon, menuItems, buttonClasses, iconClasses}) => {
  return (
    <div className="text-right relative">
      <Menu as="div" className="relative inline-block text-right">
        <div className="flex flex-row items-center">
          <Menu.Button className={buttonClasses}>
            {/* Options */}
            { (buttonType === 'icon' || buttonType === 'combo') && 
              <img src={buttonIcon} alt="dropdown" className={iconClasses} />
            }

            {buttonType !== "icon" &&
              buttonText
            }

            {buttonType !== "icon" &&
                <ChevronDownIcon
                  className="w-4 h-4 text-opacity-40 inline ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
            }
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
          <Menu.Items className="absolute right-0 w-56 mt-2 z-20 origin-top-right bg-white border border-secondary border-opacity-20 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
            {menuItems.map((item, itemIndex) => (<Menu.Item key={itemIndex}>
                {({ active }) => (
                  <button
                    className={`font-sofia-pro text-sm text-secondary ${
                      active ? 'bg-gray-100' : 'text-opacity-80'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm hover:text-opacity-30`}
                  >
                    {item.icon &&
                        <span className="mr-1">
                            <img src={item.icon} alt="icon" className="w-6"/> 
                        </span>
                    }
                    {item.label}
                  </button>
                )}
              </Menu.Item>))}
            </div> 
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}


export default DropdownMenu

