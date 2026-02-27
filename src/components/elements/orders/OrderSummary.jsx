import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import GlobeIcon from '../icons/GlobeIcon'
import StoreFrontIcon from '../../../components/elements/icons/StoreFrontIcon'

const OrderSummary = ({item}) => {
  return (
    <div className='w-full'>
        <p className='font-medium'>{item.alias}</p>
        <p className='text-xs'>Date: {new Date(item?.createdAt).toDateString()} - {new Date(item?.createdAt).toLocaleTimeString()}</p>
    
    </div>
  )
}

export default OrderSummary