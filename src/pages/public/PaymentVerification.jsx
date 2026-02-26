import React, { useEffect, useState } from 'react'
import TableLayout from '../../components/Layouts/TableLayout'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ERROR } from '../../store/types'
import InlinePreloader from '../../components/elements/InlinePreloader'
import axios from 'axios'
import { baseUrl } from '../../utils'
import { fetchCart } from '../../store/actions/cartActions'
import SuccessIcon from '../../assets/images/icons/check.svg'
import FailIcon from '../../assets/images/icons/payment-error.svg'
import ArrowIcon from '../../components/elements/icons/ArrowIcon'

const PaymentVerification = () => {
    const [processing, setProcessing] = useState(true)
    const { tableId } = useParams()
    const [searchParams] = useSearchParams()
    const trxRef = searchParams.get('trxref')
    const dispatch = useDispatch()
    const [verification, setVerification] = useState(null)
    const [order, setOrder] = useState(null)

    useEffect(() => {
        
        const verifyPayment = async () => {
            try {
                const headers = {
                    "x-original-host": window && window.location.host 
                }
                setProcessing(true)
                const response = await axios.get(`${baseUrl}/verify-payment/${trxRef}`, {headers})
                setVerification(response.data.data.verification)
                setOrder(response.data.data.order)
                dispatch(fetchCart())
                setProcessing(false)
                // setActiveItems(re
                
            } catch (error) {
                dispatch({
                    type: ERROR,
                    error
                })
            }
        } 

        if (trxRef) {
            verifyPayment()
        }
    
        return () => {
            
        }
    }, [trxRef, dispatch])
    
    return (
        <TableLayout>
            <div className='w-full p-5'>
                <div className='bg-white p-8 rounded min-h-[70vh] h-inherit'>
                    {processing ?
                        <div className='flex items-center justify-center'>
                            <div className='flex-col items-center text-center'>
                                <InlinePreloader />
                                <p className='text-sm mt-5 text-gray-500 text-center'>Validating your payment...</p>
                            </div>
                        </div>
                    :
                        <div className='w-full'>
                            {verification.status === 'success' && 
                                <div className='w-full text-center'>
                                    <img src={SuccessIcon} className='w-[50%] mx-auto' />

                                    <p className='text-sm text-ss-dark-blue font-medium'>Your payment was successful and your order has been placed</p>
                                    <p className='uppercase tracking-[0.5em] text-xs mb-1 text-gray-500 mt-3'>order ref</p>
                                    <h1 className='font-semibold text-ss-dark-blue mb-5 text-3xl'>{order.orderRef}</h1>

                                    <Link to={`/customer-order/${order.orderRef}`} className='flex items-center justify-center gap-x-2 mx-auto p-3 rounded border border-ss-dark-blue/50 bg-ss-pale-blue/50 text-ss-dark-blue text-sm font-semibold transition duration-200'>
                                        See Order Details
                                        <ArrowIcon className={`w-4 h-4`} />
                                    </Link>

                                    {/* <Link to={`/customer-order/${order.orderRef}`} className='flex items-center justify-center gap-x-2 mx-auto p-3 rounded border border-ss-dark-blue/50 bg-ss-pale-blue/50 text-ss-dark-blue text-sm font-semibold transition duration-200'>
                                        Start a new Order
                                        <ArrowIcon className={`w-4 h-4`} />
                                    </Link> */}
                                </div>
                            }

                            {verification.status === 'failed' && 
                                <div className='w-full text-center'>
                                    <img src={FailIcon} className='w-[50%] mx-auto' />

                                    <p className='text-sm text-red-700 font-medium'>Sorry, Your payment was not successful. please try again</p>
                                    <p className='uppercase tracking-[0.5em] text-xs mb-1 text-gray-500 mt-3'>order ref</p>
                                    {/* <h1 className='font-semibold text-ss-dark-blue mb-5 text-3xl'>{order.orderRef}</h1>

                                    <button className='flex items-center justify-center gap-x-2 mx-auto p-3 rounded border border-ss-dark-blue/50 bg-ss-pale-blue/50 text-ss-dark-blue text-sm font-semibold transition duration-200'>
                                        See Order Details
                                        <ArrowIcon className={`w-4 h-4`} />
                                    </button> */}
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </TableLayout>
    )
}

export default PaymentVerification