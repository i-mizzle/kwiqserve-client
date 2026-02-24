import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { baseUrl, businessDetails } from '../../utils'
import { ERROR } from '../../store/types'
import { checkoutCart, fetchCart } from '../../store/actions/cartActions'
import TableLayout from '../../components/Layouts/TableLayout'
import ItemInBag from '../../components/elements/items/ItemInBag'
import Loader from '../../components/elements/Loader'
import { Link, useParams } from 'react-router-dom'
import TextField from '../../components/elements/form/TextField'
import RadioGroup from '../../components/elements/form/RadioGroup'
import ArrowIcon from '../../components/elements/icons/ArrowIcon'
import InlinePreloader from '../../components/elements/InlinePreloader'

const Cart = () => {
// Steps
  // 1. Cart preview
  // 2. Select delivery address (or create one)
  // 3. Select payment method (Card payment, payment on delivery)
  // 4. Success/failure

  const dispatch = useDispatch()
  const cartState = useSelector((state => state.cart))
  const [priceCard, setPriceCard] = useState(null)

  const [storeSettings, setStoreSettings] = useState(null)

  const {tableId} = useParams()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchTableMenu = async (menuId) => {
      try {
        const headers = {
          "x-original-host": window && window.location.host 
        }
        setLoading(true)
        const response = await axios.get(`${baseUrl}/menus/${menuId}?expand=items.parentItem`, {headers})
        setPriceCard(response.data.data)
        // setActiveItems(response.data.data.items)
        setLoading(false)
      } catch (error) {
        console.log('table menu error: ', error)
        dispatch ({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    } 

    const fetchTableDetails = async () => {
      try {
        const headers = {
          "x-original-host": window && window.location.host 
        }
        setLoading(true)
        const response = await axios.get(`${baseUrl}/tables/${tableId}`, headers)
        // setTableDetails(response.data.data)
        fetchTableMenu(response.data.data.menu)
        // setLoading(false)
      } catch (error) {
        console.log('table details error: ', error)

        dispatch ({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    } 

    fetchTableDetails()
    dispatch(fetchCart())

    // const fetchStoreSettings = async () => {    
    //   try{
    //     const headers = {
    //       "x-original-host": window && window.location.host
    //     }

    //     dispatch({
    //       type: FETCHING_SETTINGS,
    //       payload: true
    //     })
    //     const response = await axios.get(`${baseUrl}/settings`, { headers })
    //     setStoreSettings(response.data.data)
    //     if(response.data.data.onlinePayments.enabled) {
    //       setActivePaymentOptions([...activePaymentOptions, {
    //         label: 'POS on delivery or pickup',
    //         value: 'POS_ON_DELIVERY'
    //       }])
    //     }
    //     dispatch({
    //       type: FETCHING_SETTINGS,
    //       payload: false
    //     })
    //   }
    //   catch(error){
    //     console.log(error)
    //     dispatch({
    //       type: SETTINGS_ERROR,
    //       error
    //     })
    //   }
    // }

    // fetchStoreSettings()

    return () => {
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [activeStep, setActiveStep] = useState(1);
  const [activePaymentOption, setActivePaymentOption] = useState(null);
  // const [deliveryAddress, setDeliveryAddress] = useState({});

  const paymentOptions = [
    {
      label: 'Online (Card) Payment',
      value: 'ONLINE'
    },
    {
      label: 'Cash on Service',
      value: 'CASH_ON_DELIVERY'
    },
    {
      label: 'POS on Service',
      value: 'POS_ON_DELIVERY'
    },
  ]

  const [activePaymentOptions, setActivePaymentOptions] = useState(paymentOptions)

  // const deliveryOptions = [
  //   {
  //     label: 'Doorstep delivery',
  //     value: 'DOORSTEP'
  //   },
  //   {
  //     label: 'Pickup at an outlet',
  //     value: 'PICKUP'
  //   }
  // ]

  const [activeDeliveryOption, setActiveDeliveryOption] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const totalAmount = () => {
    const totalPrice = cartState?.cart?.items.reduce((a, b) => a + (b.price * b.quantity || 0), 0)
    const vat = totalPrice * 0.075
    return {
      total: totalPrice, 
      vat: vat
    }
  }

  // const [deliveryCost, setDeliveryCost] = useState(0);

  const [validationErrors, setValidationErrors] = useState();


  const validateForm = () => {
    let errors = {}
    if (!userDetails.name || userDetails.name === '') {
        errors.name = true
    }

    if (!userDetails.email || userDetails.email === '') {
        errors.email = true
    }

    if (!userDetails?.phone || userDetails.phone === '') {
        errors.phone = true
    }

    if(!activePaymentOption){
      errors.paymentOption = true
    }

    // if(activeDeliveryOption === 'DOORSTEP') {
    //   if (!deliveryAddress.address || userDetails.address === '') {
    //     errors.address = true
    //   }

    //   if (!deliveryAddress.city || deliveryAddress.city === '') {
    //       errors.city = true
    //   }

    //   // if (!deliveryAddress?.state || userDetails.state === '') {
    //   //     errors.state = true
    //   // }
    // }

    setValidationErrors(errors)
    return errors
  }

  const storeId = businessDetails()._id

  const checkout = async () => {
    if (Object.values(validateForm()).includes(true)) {
      dispatch({
          type: ERROR,
          error: {response: {data: {
              message: 'Please check the highlighted fields'
          }}}
      });
      return
    }
    if(activePaymentOption === 'ONLINE') {
      initiatePayment()
    } else {
      processOrder()
    }
  }

  const [initiatingPayment, setInitiatingPayment] = useState(false)

  const initiatePayment = async () => {
    const headers = {
      "x-original-host": window && window.location.host 
    }
    
    const payload = {
      cart: cartState.cart._id,
      paymentChannel: 'web',
      customer: {
        email: userDetails.email
      },
      callbackUrl: `${window.location.host}/tables/${tableId}/verify-payment`
    }

    try {
      setInitiatingPayment(true)
      const response = await axios.post(`${baseUrl}/initialize-purchase`, payload, {headers})
      window.location.href = response.data.data.authorization_url
      
      // setInitiatingPayment(false)
    } catch (error) {
      console.log('payment error: ', error)
      dispatch({
        type: ERROR,
        error
      })
      setInitiatingPayment(false)
    }
  }

  const processOrder = () => {

    const payload = {
      deliveryType: activeDeliveryOption,
      paymentMethod: activePaymentOption,
      paymentStatus: 'PENDING',
      sourceMenu: priceCard._id,
      table: tableId,
      business: businessDetails()._id,
      orderBy: userDetails,
      total: totalAmount().total + totalAmount().vat
    }

    // if(payload.deliveryType === 'DOORSTEP') {
    //   payload.deliveryAddress = deliveryAddress
    // }

    // if(payload.deliveryType === 'PICKUP') {
    //   payload.pickupOutlet = storeId
    // }

    dispatch(checkoutCart(cartState.cart._id, payload))
  }

  return (
    <TableLayout>
      {
        cartState?.fetchingCart ? 
          <Loader />
        :
        <>
          {!cartState?.order && <div className='min-h-screen h-inherit bg-gray-50 bg-opacity-50 px-4 lg:px-24 xl:px-32'>
            <div className='mt-2 px-4'>
              <Link to={`/tables/${tableId}`} className='flex items-center gap-x-2 text-ss-dark-gray font-medium font-family-bricolage-grotesque! text-sm'>
                <ArrowIcon className={`w-4 h-4 -rotate-180`} />
                Back to table
              </Link>
            </div>
            {activeStep === 1 && 
              <div className='w-full'>
                <div className='w-full lg:w-8/12 xl:w-7/12 2xl:w-5/12 mt-4 mx-auto p-8 bg-white shadow-xl shadow-ss-dark-blue/10'>
                  {cartState?.cart?.items.length > 0 ? <div className=''>
                    <h3 className='font-semibold text-4xl'>Your Order</h3>
                    <p className='mt-2 mb-2 pb-4 text-sm border-b border-gray-300'>You can add or remove items from your bag by clicking the +/- buttons and click on "Proceed to checkout" when you're ready.</p>

                    {cartState?.cart?.items?.map((item, itemIndex) => (
                      <ItemInBag item={item} key={itemIndex} />
                    ))}
                      <div className='mb-4 mt-12  flex gap-x-2'>
                        <p className="text-gray-500">Total:</p>
                        <h1 className="uppercase text-ss-black text-4xl mb-3 font-bold">N{totalAmount().total.toLocaleString()}</h1>
                      </div>
                    <button onClick={()=>{setActiveStep(2)}} className='w-full bg-ss-dark-blue text-ss-pale-blue p-5 rounded-lg text-center font-medium '>Proceed to Checkout</button>
                  </div>
                  :
                  <div className='w-full text-center'>
                    <p className='text-sm text-gray-500'>You do not have any items in your bag yet. <Link
                     to={`/storefront`} className="text-green-500 font-medium">Click here</Link> to go to the store.</p>
                  </div>
                  }
                </div>
              </div>
            }
            {activeStep === 2 && 
              <div className='w-full xl:flex items-start gap-x-3.75 justify-center relative'>
                <div className='w-full xl:w-5/12'>
                  <div className='p-8 bg-white w-full shadow-xl shadow-green-500/5 mb-5 mt-4'>
                    <p className="uppercase tracking-[0.2em] text-gray-600">YOUR DETAILS</p>
                    <p className='mt-2 mb-2 pb-4 border-b border-gray-300 text-sm'>Your name and contact details</p>

                    <div className="">
                      {/* <p className='mt-2 mb-2 pb-4 border-gray-300 text-sm'>Please provide your delivery address</p> */}

                      <div className="xl:flex items-center justify-between gap-x-2 my-2">
                        <div className='w-full'>
                          <TextField
                            inputType="text" 
                            fieldId={`name`}
                            inputLabel="Full name" 
                            inputPlaceholder={`Your full name`}
                            preloadValue={''}
                            hasError={validationErrors?.name} 
                            returnFieldValue={(value)=>{setUserDetails({...userDetails, ...{name: value}})}}
                          />
                        </div>
                      </div>
                      <div className="xl:flex items-center justify-between gap-x-2 my-2">
                        <div className='w-full'>
                          <TextField
                            inputType="text" 
                            fieldId={`phone`}
                            inputPlaceholder={`Active phone number`}
                            inputLabel="Phone number" 
                            preloadValue={''}
                            hasError={validationErrors?.phone} 
                            returnFieldValue={(value)=>{setUserDetails({...userDetails, ...{phone: value}})}}
                          />
                        </div>
                        <div className='w-full mt-2 xl:mt-0'>
                          <TextField
                            inputType="text" 
                            fieldId={`email`}
                            inputPlaceholder={`Your active email address`}
                            inputLabel="Email address" 
                            preloadValue={''}
                            hasError={validationErrors?.email} 
                            returnFieldValue={(value)=>{setUserDetails({...userDetails, ...{email: value}})}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className='p-8 bg-white mx-auto mb-5 mt-4 shadow-xl shadow-green-500/5'> */}
                    {/* <p className="uppercase tracking-[0.2em] text-gray-600">DELIVERY OPTIONS</p>
                    <p className='mt-2 mb-2 pb-4 border-b border-gray-300 text-sm'>How would you like your ordered items to get to you?</p>

                    <RadioGroup
                      items={deliveryOptions}
                      returnSelected={(selected)=>{setActiveDeliveryOption(selected.value)}}
                      inline={true}
                      hasError={validationErrors?.deliveryOption}
                    />

                    {activeDeliveryOption === 'DOORSTEP' && <div className="p-3">
                      <p className='mt-2 mb-1 pb-2 border-gray-300 text-sm'>Please provide your delivery address</p>

                      <div className="flex items-center justify-between gap-x-2 my-2">
                        <div className='w-full'>
                          <TextField
                            inputType="text" 
                            fieldId={`address`}
                            inputLabel="Address" 
                            inputPlaceholder={`Your delivery address`}
                            preloadValue={''}
                            hasError={validationErrors?.address} 
                            returnFieldValue={(value)=>{setDeliveryAddress({...deliveryAddress, ...{address: value}})}}
                          />
                        </div>
                      </div>

                      <div className="xl:flex items-start justify-between gap-x-2 my-2">
                        {storeSettings?.deliveryCharges?.charges?.length > 0 && <div className='w-full'>
                          <SelectField
                            selectOptions={storeSettings?.deliveryCharges?.charges}
                            inputLabel="Select delivery city"
                            titleField="location"
                            displayImage={false}
                            imageField=""
                            preSelected=''
                            inputPlaceholder={`Select your city`}
                            fieldId="delivery-location"
                            hasError={validationErrors?.city}
                            // return id of accounts of the selected option
                            returnFieldValue={(value) => {
                              setDeliveryAddress({...deliveryAddress, ...{city: value.location}})
                              setDeliveryCost(value.charge)
                            }}
                          />
                          <label className='block text-xs mt-2 text-green-500 px-1'>Please select one of the locations above. We only deliver to these locations</label>
                        </div>}
                        <div className='w-full mt-6 xl:mt-0'>
                          <TextField
                            inputType="text" 
                            fieldId={`state`}
                            inputLabel="State" 
                            preloadValue={''}
                            hasError={validationErrors?.state} 
                            returnFieldValue={(value)=>{setDeliveryAddress({...deliveryAddress, ...{state: value}})}}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-x-2 my-2">
                        <div className='w-full'>
                          <TextField
                            inputType="text" 
                            fieldId={`description`}
                            inputLabel="Description or landmark" 
                            inputPlaceholder={`Any popular landmarks around your area`}
                            preloadValue={''}
                            hasError={false} 
                            returnFieldValue={(value)=>{setDeliveryAddress({...deliveryAddress, ...{description: value}})}}
                          />
                        </div>
                      </div>


                    </div>} */}

                    {/* {activeDeliveryOption === 'PICKUP' && <div className="p-3">
                      <p className='mt-2 mb-2 pb-4 border-gray-300 text-sm'>Please select the closest outlet to your location</p>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div onClick={()=>{setSelectedOutlet(storeSettings?.storeDetails?._id)}} className={`cursor-pointer w-full p-4 rounded transition duration-200 border ${selectedOutlet === storeSettings?.storeDetails?._id ? 'border-green-500 bg-green-100 bg-opacity-50' : 'border-transparent bg-white'}`}>
                          <p className="font-space-grotesk text-gray-800">{storeSettings?.storeDetails?.name}</p>
                          <p className='mt-1.25 text-xs'>{storeSettings?.storeDetails?.address}</p>
                        </div>
                      </div>

                    </div>} */}

                  {/* </div> */}

                  <div className='p-8 bg-white mx-auto mb-5 shadow-xl shadow-green-500/5'>
                    <p className="uppercase tracking-[0.2em] text-gray-600">PAYMENT METHOD</p>
                    <p className='mt-2 mb-2 pb-4 border-b border-gray-300 text-sm'>Please select your preferred method of payment for this order.</p>

                    {activePaymentOptions && <RadioGroup
                      items={activePaymentOptions}
                      returnSelected={(value)=>{setActivePaymentOption(value.value)}}
                      inline={false}
                      hasError={validationErrors?.paymentOption}
                    />}

                  </div>
                </div>
                <div className='w-full xl:w-4/12 p-8 bg-white mt-2 shadow-xl shadow-green-500/5 xl:sticky xl:top-12.5'>
                  <div className=''>
                    <h1 className="text-gray-600 text-4xl">Checkout Items</h1>
                    <p className='mt-2 mb-2 pb-4 border-b border-gray-300 text-sm'>You can add or remove items from your bag by clicking the +/- buttons</p>

                    {cartState?.cart?.items?.map((item, itemIndex) => (
                      <ItemInBag item={item} key={itemIndex} smallPhotos={true} />
                    ))}
                      <div className='mb-4 mt-12 flex gap-x-2 justify-between'>
                        <p className="text-gray-500 text-sm">Subtotal:</p>
                        <h3 className="uppercase text-ss-black text-xl font-semibold">N{totalAmount()?.total?.toLocaleString()}</h3>
                      </div>
                      <div className='mb-4 mt-2 flex gap-x-2 justify-between'>
                        <p className="text-gray-500 text-sm">VAT:</p>
                        <h3 className="text-ss-black text-lg font-semibold">N{totalAmount()?.vat?.toLocaleString()}</h3>
                      </div>
                      

                    <button onClick={()=>{checkout()}} className='w-full rounded-lg bg-ss-dark-blue text-ss-pale-blue p-5 text-center font-bold font-syne flex items-center justify-center'>
                      {(cartState.checkingOut || initiatingPayment) ? <InlinePreloader /> : 'Complete your order'}
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>}

          {cartState?.order && <div className='min-h-screen h-inherit bg-gray-100 p-4 lg:p-24 xl:p-32 pt-25'>
            <div className='w-full'>
              <div className='w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-5/12 mx-auto p-8 bg-white'>
                <div className=''>
                  <h3 className='font-semibold font-space-grotesk'>Thank you</h3>
                  <p className='mt-2 mb-2 pb-4 border-b border-gray-300'>Your order has been placed and is currently processed</p>

                  {(activePaymentOption === 'CASH_ON_DELIVERY' || activePaymentOption === 'POS_ON_DELIVERY') && <p className='mt-2 mb-2 pb-4 border-b border-gray-300'>You will be required to pay the following total at delivery or pickup </p>}
                  
                  <div className='mb-4 mt-12 flex gap-x-2'>
                    <p className="text-gray-300">total:</p>
                    <p className="text-green-500 text-2xl font-space-grotesk">N{(cartState?.order?.total + cartState?.order?.vat).toLocaleString() }<span className='text-[14px]'>({cartState?.order?.vat.toLocaleString()} VAT)</span></p>
                  </div>
                  <Link to={`/storefront`} className='bg-green-500 bg-opacity-10 text-green-500 mt-8 p-5 text-center font-medium font-syne block w-full'>Return to store</Link>
                </div>
              </div>
            </div>
          </div>}
        </>

      }
    </TableLayout>
  )
}
export default Cart