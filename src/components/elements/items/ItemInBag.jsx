import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deductFromCart, sendToCart } from '../../../store/actions/cartActions'
import CloseIcon from '../icons/CloseIcon'
import PlusIcon from '../icons/PlusIcon'
import { MinusIcon } from '@heroicons/react/solid'
import { clientId } from '../../../utils'
import PhotoIcon from '../icons/PhotoIcon'
import { useParams } from 'react-router-dom'

const ItemInBag = ({item, smallPhotos=false}) => {
    const dispatch = useDispatch()
    const cartState = useSelector((state => state.cart))
    const { tableId } = useParams()
    const addItemToCart = async () => {
        const newCartItem = {
            displayName: item.displayName,
            item: item.item._id,
            parentItem: item.parentItem._id,
            parentItemCategories: item.parentItemCategories.map(cat => cat),
            quantity: 1,
            price: item.price,
        }

        const requestPayload = {
            clientId: clientId(),
            item: newCartItem,
            table: tableId
        }

        console.log('adding: ', requestPayload)


        // setAdding(true)

        const result = await dispatch(sendToCart(requestPayload))

        if (result?.success) {
            setAddedToCart(true)
            // setAdding(false)
            setTimeout(() => {
                setAddedToCart(false)
            }, 1000)
        }
    }

    const deductItemFromCart = async () => {
        const requestPayload = {
            clientId: clientId(),
            item: item.item._id,
            quantity: 1
        }
    
       dispatch(deductFromCart(requestPayload))
    }

    const removeItemFromCart = async () => {
        const requestPayload = {
            clientId: clientId(),
            item: item.item._id,
            quantity: item.quantity,
        }
    
       dispatch(deductFromCart(requestPayload))
    }

    const itemInCart = () => {
        const indexOfItemInCart = cartState?.cart?.items?.findIndex((cartItem) => 
            cartItem?.item === item.item._id
        )
        return indexOfItemInCart
    }
    

    return (
        <div className="flex items-start gap-x-3 py-6 border-b border-gray-300">
            <div className={`${smallPhotos ? 'h-12.5 xl:h-12.5 w-12.5 xl:w-12.5' : 'h-18.75 xl:h-25 w-18.75 xl:w-25'}`}>
                <div className={`${smallPhotos ? 'h-12.5 xl:h-12.5 w-12.5 xl:w-12.5' : 'h-18.75 xl:h-25 w-18.75 xl:w-25'} relative bg-gray-100 flex items-center justify-center`} 
                    style={{backgroundImage: `url(${item.parentItem.coverImage})`, backgroundPosition: 'center center', backgroundSize: 'cover'}}>
                    {!item?.parentItem?.coverImage && <PhotoIcon className={`w-8 h-8 text-gray-300`} />}
                </div>
            </div>

            <div className='w-full'>
                <div className='flex items-start justify-between'>
                    <div>
                        <p className='font-red-hat font-medium text-sm lg:text-md'>{item.parentItem.name} - {item.item.name}</p>        
                        <p className='mt-1 font-medium text-sm'>x{item.quantity}</p>
                    </div>
                    <button onClick={()=>{removeItemFromCart()}} className='flex items-center gap-x-2 text-xs'>
                        <CloseIcon className={`w-5 h-5 text-gray-400`} />
                        <span className='hidden lg:inline-block'>Remove item</span>
                    </button>
                </div>
                <div className='flex flex-row-reverse gap-x-1'>
                    <button onClick={()=>addItemToCart()} className='flex items-center gap-x-2 text-xs p-2 rounded bg-ss-pale-blue border border-ss-dark-blue/20'>
                        <PlusIcon className='w-5 h-5 text-ss-black' />
                    </button>
                    <p className='font-thin text-lg'>{cartState?.cart?.items[itemInCart()]?.quantity}</p>
                    <button onClick={()=>deductItemFromCart()} className='flex items-center gap-x-2 text-xs p-2 rounded bg-ss-pale-blue border border-ss-dark-blue/20'>
                        <MinusIcon className='w-5 h-5 text-ss-black' />
                    </button>
                </div> 
            </div>

        </div>
    )
}

export default ItemInBag