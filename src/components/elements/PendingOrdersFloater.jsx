import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './PendingOrdersFloater.css'
import { authHeader, baseUrl } from '../../utils'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PendingOrdersFloater = () => {
    const dispatch = useDispatch()
    const componentRef = useRef(null)
    const [isHighlighted, setIsHighlighted] = useState(false)
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
    // const ordersSelector = useSelector()

    // Listen to socket events and trigger highlight + refresh orders
    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const headers = authHeader()
                const response = await axios.get(`${baseUrl}/orders?status=pending&paymentStatus=paid&paymentMethod=cash_on_delivery,pos_on_delivery&page=0&perPage=0`, {headers})
                setPendingOrdersCount(response.data.data.total)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPendingOrders()

        // Wait for socket to be available with retry mechanism
        let retries = 0;
        const maxRetries = 20; // 2 seconds with 100ms intervals
        
        const tryAttachSocket = () => {
            const socket = window.__socket;
            
            if (!socket) {
                retries++;
                if (retries < maxRetries) {
                    // Retry in 100ms
                    setTimeout(tryAttachSocket, 100);
                } else {
                    console.error('Socket not available after multiple retries in PendingOrdersFloater');
                }
                return;
            }

            console.log('✅ Socket attached to PendingOrdersFloater');

            const handleOrderEvent = () => {
                setIsHighlighted(true)
                
                // Refresh the pending orders list
                fetchPendingOrders()
                
                // Remove highlight after animation completes
                setTimeout(() => {
                    setIsHighlighted(false)
                }, 2000)
            }

            socket.on('order:new', handleOrderEvent)
            socket.on('order:delivered', handleOrderEvent)

            // Cleanup function
            return () => {
                socket.off('order:new', handleOrderEvent)
                socket.off('order:delivered', handleOrderEvent)
            }
        }

        const cleanup = tryAttachSocket();

        return () => {
            if (cleanup) cleanup();
        }
    }, [dispatch])
    
  return (
    <>
        {pendingOrdersCount > 0 && <Link
            to={`/business/orders`} 
            ref={componentRef} 
            className={`pending-orders-floater fixed top-20 z-90 rounded-full py-3 px-6 right-4 bg-green-500 border border-white shadow-xl shadow-green-500/20 ${isHighlighted ? 'highlight-pulse' : ''}`}
        >
            <h3 className='text-white text-sm font-bold'>{pendingOrdersCount} pending order(s)</h3>
        </Link>}
    </>
  )
}

export default PendingOrdersFloater