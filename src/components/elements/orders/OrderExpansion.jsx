import React from 'react'
import ArrowNarrowRight from '../icons/ArrowNarrowRight'
import CloseIcon from '../icons/CloseIcon'
import { Link } from 'react-router-dom'

const OrderExpansion = ({orders, rowOpen}) => {

    return (
        <div className='w-full bg-white bg-opacity-80 border-t border-gray-300 rounded-b-md py-6 px-12'>
            <h3 className='text-lg font-medium mb-4'>Items in this order</h3>
            {orders[rowOpen].items && orders[rowOpen].items.length > 0 && orders[rowOpen].items.map((item, itemIndex) => (
                <div key={itemIndex} className='flex flex-row gap-x-4 justify-between my-3 hover:bg-gray-200 transition duration-200 py-2 rounded px-6'>
                    <div className='flex gap-x-2 items-start'>
                        {/* <button className='mt-1 rounded bg-gray-200 text-gray-700 p-1 transition duration-200 border border-gray-700 hover:bg-gray-400'><CloseIcon className="w-3 h-3" /></button> */}
                        <div>
                            <p className='font-medium'>{item.displayName}</p>
                            <p className='font-thin text-gray-400'>{item.sku}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        {/* <button className='rounded bg-blue-700 text-white text-xl px-4 py-1 transition duration-200 border border-blue-700 hover:bg-blue-800'>-</button> */}
                        <input readOnly className='w-12.5 px-4 py-2 rounded border border-gray-400 focus:border-gray-600 transition duration-200' value={item.quantity} />
                        {/* <button className='rounded bg-blue-700 text-white text-xl px-4 py-1 transition duration-200 border border-blue-700 hover:bg-blue-800'>+</button> */}
                    </div>
                </div>
            ))}

            <Link to={`/business/orders/order/${orders[rowOpen]._id}`} className='flex flex-row items-center gap-x-3 mt-5 hover:text-blue-700 transition duration-200'>See full order details <ArrowNarrowRight className={`w-6 h-6`} /></Link>

        </div>
    )

}

export default OrderExpansion