import React, { useEffect, useState } from 'react'
import TableLayout from '../../components/Layouts/TableLayout'
import { ERROR } from '../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { baseUrl, itemQuantityPriceMultiplier, orderTotal, unSlugify } from '../../utils'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../components/elements/Loader'
import CloseIcon from '../../components/elements/icons/CloseIcon'
import MoneyIcon from '../../components/elements/icons/MoneyIcon'
import CalculatorIcon from '../../components/elements/icons/CalculatorIcon'
import OrderStatus from '../../components/elements/orders/OrderStatus'
import ArrowIcon from '../../components/elements/icons/ArrowIcon'

const CustomerOrderDetails = () => {
  const dispatch = useDispatch()

  const settingsState = useSelector((state => state.settings))
  const { orderRef } = useParams()

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const headers = {
          "x-original-host": window && window.location.host 
        }
        setLoading(true)
        const response = await axios.get(`${baseUrl}/public/orders/details/${orderRef}?expand=table,customer`, {headers})
        setOrder(response.data.data)
        setLoading(false)          
      } catch (error) {
        dispatch({
          type: ERROR,
          error
        })
      }
    } 
    
    getOrderDetails()
  
    return () => {
    
    }
  }, [])
  
  return (
    <TableLayout>
        {loading ?
        <Loader />
        :
        <>
          <div className='relative w-full pt-6'>
            {<div className='w-full px-8 xl:px-5'>
                <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>ORDER REF</label>
                <div className='flex items-start gap-x-1'>
                  <h3 className='text-xl font-semibold mb-3 uppercase'>{order?.orderRef}</h3>
                  <div className='mt-0.5'>
                    <OrderStatus status={order.status} />
                  </div>
                </div>

                <div className='rounded-md border bg-white border-gray-100 p-5 w-full '>
                    <p className='font-medium text-gray-700 border-b w-full pb-2 mb-5 text-sm'>Customer</p>

                    {/* <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>NAME</label> */}
                    <h3 className='text-xl font-semibold mb-1'>{order?.customer?.name}</h3>

                    {/* <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>EMAIL</label> */}
                    <p className='text-sm'>{order?.customer?.email}, {order?.customer?.phone}</p>

                    {/* <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>PHONE</label>
                    <p className='text-sm mb-3'>{order?.customer?.phone}</p> */}
                </div>
                <div className='rounded-md border bg-ss-pale-blue/50 border-blue-200 p-5 mt-5 w-full '>
                    <p className='font-medium text-gray-700 border-b w-full pb-2 mb-2 text-sm'>Table</p>

                    <h3 className='text-lg mb-1'>{order?.table?.name}</h3>
                    <p className='text-sm text-gray-600'>{order?.table?.description}</p>
                    
                </div>
                <div className='w-full mt-5 p-2.5'>
                      <label className='w-full block mb-2 text-[11px] tracking-[0.2em]'>PAYMENT TYPE</label>
                    <div className='flex items-center gap-x-2 mb-4'>
                        {order?.paymentMethod === 'pos_on_delivery' && <CalculatorIcon className={`text-green-600 w-5 h-5`} />}
                        {order?.paymentMethod === 'cash_on_delivery' && <MoneyIcon className={`text-green-500 w-5 h-5`} />}
                        <p className='text-sm capitalize'>{unSlugify(order?.paymentMethod?.toLowerCase())}</p>
                    </div>
                </div>
                
                <h3 className='text-lg font-medium mb-4'>Items in this order</h3>
                {order.items && order.items.length > 0 && order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className='flex flex-row gap-x-4 justify-between my-3 py-1 rounded border-b border-gray-300'>
                        <div className='flex gap-x-2 items-start'>
                            {/* {order?.paymentStatus !== 'PAID' && <button onClick={()=>{updateOrderQuantity(itemIndex, 'remove', item.quantity)}} className='mt-1 rounded bg-gray-200 text-gray-700 p-1 transition duration-200 border border-gray-700 hover:bg-gray-400'><CloseIcon className="w-3 h-3" /></button>} */}
                            <div>
                                <p className='font-medium text-sm'>{item.displayName}</p>
                                <p className='text-gray-500 text-sm'>₦{itemQuantityPriceMultiplier(settingsState?.settings, item.price)}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-2'>
                           
                            <input readOnly className='w-12.5 px-4 py-2 rounded border border-gray-400 focus:border-gray-600 transition duration-200' value={item.quantity} />
                            
                        </div>
                    </div>
                ))}
                {order.items && order.items.length > 0 && 
                settingsState?.settings?.taxes && 
                settingsState?.settings?.taxes?.enabled && 
                    <div className='flex flex-row gap-x-4 justify-between my-3 py-1 rounded'>
                        <div className='flex gap-x-2 items-start'>
                            <div>
                                <p className='font-medium text-sm'>Taxes ({settingsState?.settings?.taxes?.rate * 100}%)</p>
                                {/* <p className='text-gray-500 text-sm'>₦{item.price}</p> */}
                            </div>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <p className='font-medium text-sm'>{orderTotal(order, settingsState.settings).vat.toLocaleString()}</p>
                        </div>
                    </div>
                }

                <h3 className='text-3xl text-gray-600 pr-2.5 font-medium mt-5'><span className='text-sm'>NGN </span>{orderTotal(order, settingsState?.settings)?.total?.toLocaleString()}</h3>

                <Link to={`/tables/${order.table._id}`} className='flex items-center justify-center gap-x-2 mx-auto p-3 rounded border border-ss-dark-blue/50 bg-ss-pale-blue/50 text-ss-dark-blue text-sm font-semibold transition duration-200 mt-5'>
                    Create a new order
                    <ArrowIcon className={`w-4 h-4`} />
                </Link>
                <p className='mt-4 text-ss-dark-gray text-[13px] font-medium'>If you have moved to another table, you can scan the qr-code on the new table again to get started</p>

                
            </div>}
        </div>
        </>
        }
    </TableLayout>
  )
}

export default CustomerOrderDetails