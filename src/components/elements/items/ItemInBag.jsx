import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deductFromCart, sendToCart } from '../../../store/actions/cartActions'
import CloseIcon from '../icons/CloseIcon'
import PlusIcon from '../icons/PlusIcon'
import { MinusIcon } from '@heroicons/react/solid'
import { businessDetails, clientId } from '../../../utils'
import PhotoIcon from '../icons/PhotoIcon'
import { useParams } from 'react-router-dom'

const ItemInBag = ({item, smallPhotos=false}) => {
    const dispatch = useDispatch()
    const cartState = useSelector((state => state.cart))
    const { tableId } = useParams()

    const itemId = item?.item?._id || item?.item
    const parentItemId = item?.parentItem?._id || item?.parentItem
    const businessId = cartState?.cart?.business?._id || cartState?.cart?.business || businessDetails()?._id
    const cartItem = cartState?.cart?.items?.find((cartItemData) => {
        const cartItemId = cartItemData?.item?._id || cartItemData?.item
        return cartItemId === itemId
    })
    const displayedQuantity = cartItem?.quantity ?? item?.quantity ?? 0
    const isUpdatingCart = cartState?.sendingToCart || cartState?.deductingFromCart

    const addItemToCart = async () => {
        if (!itemId || !parentItemId || !businessId) {
            return
        }

        const newCartItem = {
            displayName: item.displayName,
            item: itemId,
            parentItem: parentItemId,
            parentItemCategories: Array.isArray(item?.parentItemCategories) ? item.parentItemCategories.map((cat) => cat) : [],
            quantity: 1,
            price: item.price,
        }

        const requestPayload = {
            clientId: clientId(),
            item: newCartItem,
            table: tableId,
            business: businessId
        }

        const result = await dispatch(sendToCart(requestPayload))

        return result
    }

    const deductItemFromCart = async () => {
        if (!itemId || !businessId || displayedQuantity <= 0) {
            return
        }

        const requestPayload = {
            clientId: clientId(),
            item: itemId,
            quantity: 1,
            business: businessId
        }
    
       dispatch(deductFromCart(requestPayload))
    }

    const removeItemFromCart = async () => {
        if (!itemId || !businessId || displayedQuantity <= 0) {
            return
        }

        const requestPayload = {
            clientId: clientId(),
            item: itemId,
            quantity: displayedQuantity,
            business: businessId,
        }
    
       dispatch(deductFromCart(requestPayload))
    }
    

    return (
        <div className="flex items-start gap-x-3 py-6 border-b border-gray-300">
            <div className={`${smallPhotos ? 'h-12.5 xl:h-12.5 w-12.5 xl:w-12.5' : 'h-18.75 xl:h-25 w-18.75 xl:w-25'}`}>
                <div className={`${smallPhotos ? 'h-12.5 xl:h-12.5 w-12.5 xl:w-12.5' : 'h-18.75 xl:h-25 w-18.75 xl:w-25'} relative bg-gray-100 flex items-center justify-center`} 
                    style={{backgroundImage: item?.parentItem?.coverImage ? `url(${item.parentItem.coverImage})` : undefined, backgroundPosition: 'center center', backgroundSize: 'cover'}}>
                    {!item?.parentItem?.coverImage && <PhotoIcon className={`w-8 h-8 text-gray-300`} />}
                </div>
            </div>

            <div className='w-full'>
                <div className='flex items-start justify-between'>
                    <div>
                        <p className='font-red-hat font-medium text-sm lg:text-md'>{item.parentItem.name} - {item.item.name}</p>        
                        <p className='mt-1 font-medium text-sm'>x{displayedQuantity}</p>
                    </div>
                    <button
                        type='button'
                        onClick={() => { removeItemFromCart() }}
                        disabled={isUpdatingCart || displayedQuantity <= 0}
                        className='flex items-center gap-x-2 text-xs disabled:opacity-60'
                    >
                        <CloseIcon className={`w-5 h-5 text-gray-400`} />
                        <span className='hidden lg:inline-block'>Remove item</span>
                    </button>
                </div>
                <div className='flex flex-row-reverse gap-x-1'>
                    <button
                        type='button'
                        onClick={() => { addItemToCart() }}
                        disabled={isUpdatingCart || !businessId}
                        className='flex items-center gap-x-2 text-xs p-2 rounded bg-ss-pale-blue border border-ss-dark-blue/20 disabled:opacity-60'
                    >
                        <PlusIcon className='w-5 h-5 text-ss-black' />
                    </button>
                    {/* <p className='font-thin text-lg'>{displayedQuantity}</p> */}
                    <button
                        type='button'
                        onClick={() => { deductItemFromCart() }}
                        disabled={isUpdatingCart || displayedQuantity <= 0}
                        className='flex items-center gap-x-2 text-xs p-2 rounded bg-ss-pale-blue border border-ss-dark-blue/20 disabled:opacity-60'
                    >
                        <MinusIcon className='w-5 h-5 text-ss-black' />
                    </button>
                </div> 
            </div>

        </div>
    )
}

export default ItemInBag