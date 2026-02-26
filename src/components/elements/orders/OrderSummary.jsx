import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import GlobeIcon from '../icons/GlobeIcon'
import StoreFrontIcon from '../../../components/elements/icons/StoreFrontIcon'

const OrderSummary = ({item}) => {
  return (
    <div className='w-full flex items-start gap-x-2'>
        {/* <div className='w-10 flex items-center justify-center h-10'>
            {item.source === 'ONLINE' && 
            <Tooltip title="Online order" placement="top">
                <div className='w-10 h-10 rounded-lg bg-green-400 bg-opacity-10 flex items-center justify-center'>
                    <GlobeIcon className={`w-5 h-5 text-green-500`} />
                </div>
            </Tooltip>
            }
            {item.source === 'ONSITE' && 
            <Tooltip title="On-site order" placement="top">
                <div className='w-10 h-10 rounded-lg bg-gray-400 bg-opacity-20 flex items-center justify-center'>
                    <StoreFrontIcon className={`w-5 h-5 text-gray-400`} />
                </div>
            </Tooltip>
            }
        </div> */}
        <div>
            <p className='font-medium'>{item.alias}</p>
            <p className='text-xs'>Date: {new Date(item?.createdAt).toDateString()} - {new Date(item?.createdAt).toLocaleTimeString()}</p>
        </div>
    </div>
  )
}

export default OrderSummary