import React, { useEffect, useState } from 'react'
import TableLayout from '../../components/Layouts/TableLayout';
import Loader from '../../components/elements/Loader';
import EmptyState from '../../components/elements/EmptyState';
import axios from 'axios';
import { ERROR } from '../../store/types';
import { baseUrl, clientId } from '../../utils';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import OrderStatus from '../../components/elements/orders/OrderStatus';
import OrderPaymentStatus from '../../components/elements/orders/OrderPaymentStatus';

const formatOrderStatus = (status) => {
    if (!status) {
        return 'Pending'
    }

    return status
        .toString()
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())
}

const getTotalQuantity = (items = []) => {
    return items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
}

const formatOrderDate = (date) => {
    if (!date) {
        return 'Unknown date'
    }

    return new Date(date).toLocaleString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString()
}

const CustomerOrders = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchClientOrders = async () => {
            try {
                const headers = {
                    "x-original-host": window && window.location.host 
                }
                setLoading(true)
                const response = await axios.get(`${baseUrl}/public/orders/${clientId()}`, { headers })

                setOrders(response.data.data.orders)
                setLoading(false)
            } catch (error) {
                console.log('table details error: ', error)

                dispatch ({
                    type: ERROR,
                    error
                })
                setLoading(false)
            }
        } 

        fetchClientOrders()
        return () => {
            
        }
    }, [dispatch])

    return (
        <TableLayout>
            <div className='p-4 lg:p-8 w-full'>
                <h1 className='text-2xl font-bold text-ss-dark-gray'>Your Orders</h1>
                <p className='text-sm text-gray-500'>Here you can see all your past orders made on this device. Click on any order to see more details.</p>
            </div>

            <div className='w-full'>
                {loading ? 
                    <Loader />
                :
                    orders.length > 0 ? 
                    <>
                        {orders.map((order, orderIndex) => (
                            <Link to={`/customer-orders/${order.orderRef}`} key={orderIndex} className='w-full flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 transition duration-200 hover:bg-gray-50'>
                                <div className='flex items-start gap-x-4 w-full'>
                                    <div className='w-10 h-10 rounded-full bg-ss-pale-blue flex items-center justify-center shrink-0'>
                                        <span className='text-sm font-semibold text-ss-dark-blue'>{getTotalQuantity(order?.items)}</span>
                                    </div>

                                    <div className='w-full flex items-start justify-between gap-4'>
                                        <div>
                                            <p className='text-sm font-semibold text-ss-dark-gray'>Order #{order?.orderRef || 'N/A'}</p>
                                            <p className='text-xs text-gray-500 mt-1'>{formatOrderDate(order?.createdAt)}</p>

                                            <div className='flex flex-wrap gap-2 mt-2'>
                                                {/* <span className='px-2 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700'>
                                                    {formatOrderStatus(order?.status)}
                                                </span> */}
                                                <OrderStatus status={order?.status} />
                                                {/* <span className='px-2 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700'>
                                                    {formatOrderStatus(order?.paymentStatus)}
                                                </span> */}
                                                <OrderPaymentStatus status={order?.paymentStatus} />
                                            </div>
                                        </div>

                                        <div className='text-right shrink-0'>
                                            <p className='text-xs text-gray-500'>Total</p>
                                            <h1 className='text-lg font-semibold text-ss-dark-gray'>₦{formatAmount(order?.total)}</h1>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </>
                    :
                    <EmptyState emptyStateText="You have not made any orders on this device yet." />
                }
            </div>   
        </TableLayout>
    )
}

export default CustomerOrders