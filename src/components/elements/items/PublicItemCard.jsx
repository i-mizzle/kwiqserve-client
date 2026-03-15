import React, { useState } from 'react'
import PhotoIcon from '../icons/PhotoIcon'
import BagIcon from '../../elements/icons/BagIcon'
import { useDispatch } from 'react-redux'
import { businessDetails, clientId } from '../../../utils'
import { sendToCart } from '../../../store/actions/cartActions'

import CheckIcon from '../icons/CheckIcon'
import InlinePreloader from '../InlinePreloader'
import { useParams } from 'react-router-dom'

const PublicItemCard = ({item, addToOrder, itemStock, hideStock, canAddItem, storeSettings, currentPage, businessId}) => {
    const dispatch = useDispatch()
    // const cartState = useSelector((state => state.cart))
    const [addedToCart, setAddedToCart] = useState(false)
    const [adding, setAdding] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const { tableId } = useParams()
    const addItemToCart = async () => {
        const resolvedBusinessId = businessId || businessDetails()?._id

        const newCartItem = {
            displayName: item.displayName,
            item: item.item,
            parentItem: item?.parentItem?._id,
            parentItemCategories: Array.isArray(item?.parentItemCategories) ? item.parentItemCategories.map(cat => cat) : [],
            quantity: quantity,
            price: item.price,
        }

        const requestPayload = {
            clientId: clientId(),
            item: newCartItem,
            table: tableId,
            business: resolvedBusinessId
        }

        setAdding(true)
    
        const result = await dispatch(sendToCart(requestPayload))
 
        if (result?.success) {
            setAddedToCart(true)
            setAdding(false)
            setTimeout(() => {
                setAddedToCart(false)
                setQuantity(1)
            }, 1000)
        } else {
            setAdding(false)
        }
    }

    // const deductItemFromCart = async () => {
    //     const requestPayload = {
    //         clientId: clientId(),
    //         item: item.item._id,
    //         quantity: 1
    //     }
    
    //    dispatch(deductFromCart(requestPayload))
    // }

    // const itemInCart = () => {
    //     const indexOfItemInCart = cartState?.cart?.items?.findIndex((cartItem) => 
    //         cartItem?.item === item.item._id
    //     )
    //     return indexOfItemInCart
    // }

    // const [submittingReview, setSubmittingReview] = useState(false)
    // const [newReview, setNewReview] = useState({})

    // const [validationErrors, setValidationErrors] = useState({})

    // const validateForm = () => {
    //     let errors = {}
        
    //     if(!newReview.rating || newReview.rating < 1) {
    //         errors.rating = true
    //     }

    //     if(!newReview.review || newReview.review === '') {
    //         errors.review = true
    //     }

    //     setValidationErrors(errors)
    //     return errors
    // }

    // const [submitting, setSubmitting] = useState(false)

    // const createReview = async () => {
    //     if (Object.values(validateForm()).includes(true)) {
    //         dispatch({
    //             type: ERROR,
    //             error: {response: {data: {
    //                 message: 'Please check the highlighted fields'
    //             }}}
    //         })
    //         return
    //     }

    //     try {
    //         const headers = {
    //             "x-original-host": window && window.location.host 
    //         }

    //         const payload = {
    //             item: item.parentItem._id,
    //             rating: newReview.rating,
    //             review: newReview.review,
    //             clientId: clientId(),
    //             source: currentPage === 'publicPriceCard' ? 'public-price-card' : 'store-front',
    //             createdBy: {
    //                 name: newReview.name || undefined,
    //                 email: newReview.email || undefined
    //             }
    //         }

    //         setSubmitting(true)
    //         await axios.post(`${baseUrl}/reviews`, payload, { headers })
    //         setSubmitting(false)

    //         dispatch({
    //             type: SUCCESS,
    //             payload: 'Your review has been submitted successfully'
    //         })
    //         setNewReview({})
    //         setSubmittingReview(false)
    //     } catch (error) {
    //         dispatch({
    //             type: ERROR,
    //             error
    //         })
    //         setSubmitting(false)
    //     }
    // }

    return (
        <>
            <div className='cursor-pointer block lg:flex items-start gap-x-2.5 w-full transition duration-200 bg-white shadow-lg shadow-ss-pale-blue/60 border border-transparent hover:bg-opacity-70 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-100'>
                <div className='w-full'>
                    {item?.parentItem?.coverImage && item?.parentItem?.coverImage !== '' ? 
                        <div className='w-full h-50 xl:h-75' style={{
                            backgroundImage: `url(" ${item?.parentItem.coverImage} ")`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'none',
                            backgroundPosition: 'center center',
                            // borderRadius: '10px',
                        }} />
                    :
                        <div className='w-full h-75 bg-gray-100 flex items-center justify-center' >
                            <PhotoIcon
                            className={`w-12 h-12 p-3 rounded-sm text-gray-400`} />
                        </div>
                    }
                </div>
                <div className={`w-full p-2 lg:p-6`}> 
                    <div className="flex flex-col justify-between gap-y-6">
                        <div>
                            <div className='min-h-15'>
                                <h3 className={`text-lg font-medium text-gray-600`}>{item.displayName}</h3>
                            </div>

                            {<h3 className={`font-bold text-lg text-green-600`}>₦{(item.price).toLocaleString()}</h3>}
                        </div>
                        <div className='flex items-center gap-x-2'>
                            {<button onClick={()=>{setQuantity(quantity-1)}} disabled={quantity===1} className='rounded bg-ss-black disabled:bg-gray-300 disabled:border-gray-300 text-white text-2xl px-4 py-1.5 transition duration-200 border border-ss-black hover:bg-ss-dark-blue'>-</button>}
                            <input readOnly className='px-4 text-center py-2 rounded border border-gray-400 focus:border-gray-600 transition w-full duration-200' value={quantity} />
                            {<button onClick={()=>{setQuantity(quantity+1)}} className='rounded bg-ss-black disabled:bg-gray-300 disabled:border-gray-300 text-white text-2xl px-4 py-1.5 transition duration-200 border border-ss-black hover:bg-ss-dark-blue'>+</button>}
                        </div>
                        {!hideStock && <div className='flex justify-between items-center'>
                            
                             <>
                                {item.inStock === true ? 
                                <button onClick={()=>{
                                    if(addedToCart) return
                                    if(!item.fixedPricing){
                                        // setSettingPrice(true)
                                        return
                                    }
                                    addItemToCart()
                                    }} disabled={adding} className='text-sm text-ss-pale-blue font-[550] font-space-grotesk bg-ss-dark-blue w-full rounded-lg px-3.75 py-3.75 bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center'>
                                        {adding ? <InlinePreloader /> : 
                                            <>
                                                {addedToCart ?
                                                    <span className='flex items-center justify-center text-green-300 gap-x-1'>
                                                        <CheckIcon className={`text-green-300 w-5 h-5`} />
                                                        <span className=''>Added to Order</span>
                                                    </span>

                                                    :
                                                    <span className='flex items-center justify-center gap-x-1'>
                                                        <BagIcon className={`w-5 h-5 xl:hidden`} />
                                                        <span className=''>Add to Order</span>
                                                    </span>
                                                }
                                            </>
                                        }
                                    {/* <ChevronIcon className={`w-4 h-4 transform -rotate-90`} /> */}
                                </button>
                                :
                                <span className='text-gray-300 text-xs'>Out of stock</span>
                                } 
                            </>
                        </div>}

                        {/* {storeSettings?.reviews?.enabled && <div className='lg:flex items-end justify-between'>
                            <div className=''>
                                <Rating rating={0} />
                                <p className='text-xs text-gray-500 mt-1.25'>from 0 review(s)</p>
                            </div>
                            {storeSettings?.reviews[currentPage] && <button onClick={()=>{setSubmittingReview(true)}} className='mt-2.5 lg:mt-0 border-b border-gray-700 text-xs text-gray-700 transition duration-200 hover:border-green-600 hover:text-green-600'>Write a review</button>}
                        </div>} */}
                    </div>
                </div>
            </div>

            {/* <ModalLayout
                isOpen={submittingReview} 
                closeModal={()=>{setSubmittingReview(false)}} 
                dialogTitle={`Submit a review for this item: ${item.parentItem.name}`}
                dialogIntro={``}
                maxWidthClass='max-w-xl'
            >
                <div className='w-full'>
                    <p className='text-sm text-gray-500'>Give this product a rating and write a review.</p>

                    <label className={`mb-2.5 block text-sm mt-5 ${validationErrors.rating ? 'text-red-500' : 'text-gray-500'}`}>Select a rating below</label>
                    <div className='flex items-center gap-x-2.5'>
                        {Array(5).fill(null).map((_, index) => (
                            <button onClick={()=>setNewReview({...newReview, ...{rating: index+1}})} key={index}>
                                {newReview.rating >= index+1 ? <StarSolidIcon className={`text-yellow-500 w-10 h-10`} /> : <StarOutlineIcon className={`text-yellow-500 w-10 h-10`} />}
                            </button>
                        ))}
                    </div>

                    <div className='w-full mt-5'>
                        <TextareaField
                            inputType="text" 
                            fieldId="review"
                            inputLabel="Your review" 
                            preloadValue={''}
                            inputPlaceholder={`Please write your review here.`}
                            hasError={validationErrors.review} 
                            returnFieldValue={(value)=>{setNewReview({...newReview, ...{review: value}})}}
                        />
                    </div>

                    <h3 className='text-gray-800 text-[15px] font-[550] mt-5'>Reviewer Details</h3>
                    <p className='text-sm text-gray-500'>You can provide your details below. If you choose not to provide it, the review will be submitted as anonymous.</p>
                    <div className='w-full mt-2.5'>
                        <TextField
                            inputType="text" 
                            fieldId="name"
                            inputLabel="Your name (optional)" 
                            preloadValue={''}
                            inputPlaceholder={`Provide your name`}
                            hasError={false} 
                            returnFieldValue={(value)=>{setNewReview({...newReview, ...{name: value}})}}
                        />
                    </div>

                    <div className='w-full mt-5'>
                        <TextField
                            inputType="text" 
                            fieldId="email"
                            inputLabel="Your email (optional)" 
                            preloadValue={''}
                            inputPlaceholder={`Provide your email`}
                            hasError={false} 
                            returnFieldValue={(value)=>{setNewReview({...newReview, ...{email: value}})}}
                        />
                    </div>

                    <div className='flex flex-row-reverse gap-x-2.5 mt-5'>
                        <FormButton 
                            buttonLabel="Submit Review" 
                            buttonAction={()=>{createReview()}} 
                            processing={submitting}
                        />
                        <button className='p-3 transition duration-200 hover:bg-gray-100 text-gray-600 text-sm rounded-lg'>Cancel</button>
                    </div>
                </div>
            </ModalLayout> */}
        </>
    )
}

export default PublicItemCard