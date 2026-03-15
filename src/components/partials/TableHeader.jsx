import React, { useEffect } from 'react'
import { businessDetails } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../../store/actions/cartActions'
import { Link, useParams } from 'react-router-dom'
import BagIcon from '../elements/icons/BagIcon'
import InlinePreloader from '../elements/InlinePreloader'

const TableHeader = () => {
    const business = businessDetails() || {}
    const cartSelector = useSelector((state => state.cart))
    const dispatch = useDispatch()
    const { tableId } = useParams()

    useEffect(() => {
        dispatch(fetchCart())
        return () => {
        
        };
    }, [dispatch]);

    return (
        <header className='px-4 lg:px-24 xl:px-32 2xl:px-44 w-full flex items-center justify-between py-5 fixed bg-white z-99'>
            <div className='flex items-center gap-x[10px] w-2/3 gap-x-5'>
                <h1 className='text-lg xl:text-xl font-family-bricolage-grotesque! font-bold'>{business?.name || 'Kwiqserve'}</h1>
            </div>
            
            {cartSelector?.fetchingCart ? <InlinePreloader /> : <Link to={`/tables/${tableId}/cart`} className='w-10 h-10 rounded-full bg-ss-pale-blue flex items-center justify-center relative'>
                {cartSelector?.cart && <span className='w-4 h-4 bg-ss-dark-blue text-white flex items-center justify-center font-medium text-[10px] rounded-full absolute -top-0.5 -right-0.5'>
                    {cartSelector?.cart?.items?.reduce((total, item) => total + item.quantity, 0)}
                </span>}
                <BagIcon className={`text-ss-dark-blue w-5 h-5`} />
            </Link>}
        </header>
    )
}

export default TableHeader