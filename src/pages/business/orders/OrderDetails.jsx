import React, { useEffect, useRef, useState } from 'react'
import CheckIconCircled from '../../../components/elements/icons/CheckIconCircled'
import CloseIcon from '../../../components/elements/icons/CloseIcon'
import TrashIcon from '../../../components/elements/icons/TrashIcon'
import Tooltip from '@mui/material/Tooltip';
import ItemCard from '../../../components/elements/items/ItemCard'
import ReceivePayment from '../../../components/elements/payments/ReceivePayment'
import BookmarkIcon from '../../../components/elements/icons/BookmarkIcon'
import SetOrderAlias from '../../../components/elements/orders/SetOrderAlias'
// import db from '../../../db'
import { useNavigate, useParams } from 'react-router-dom'
import { authHeader, baseUrl, userDetails, unSlugify, orderTotal, itemQuantityPriceMultiplier, businessDetails } from '../../../utils'
// import { useReactToPrint } from 'react-to-print';
// import Logo from '../../../assets/img/logo.png'
import InlinePreloader from '../../../components/elements/InlinePreloader'
import PrinterIcon from '../../../components/elements/icons/PrinterIcon'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Loader from '../../../components/elements/Loader'
// import { fetchStoreSettings } from '../../../store/actions/settingsActions'
import { clearCreatedOrder, clearDeletedOrder, clearUpdatedOrder, createOrder, deleteOrder, fetchOrders, updateOrder } from '../../../store/actions/ordersActions'
import { fetchCategories } from '../../../store/actions/categoriesActions'
import { fetchMenus } from '../../../store/actions/menusActions'
import UpdateOrderStatus from '../../../components/elements/orders/UpdateOrderStatus'
import OrderStatus from '../../../components/elements/orders/OrderStatus'
import OrderPaymentStatus from '../../../components/elements/orders/OrderPaymentStatus'
import StoreFrontIcon from '../../../components/elements/icons/StoreFrontIcon'
import GlobeIcon from '../../../components/elements/icons/GlobeIcon'
import CalculatorIcon from '../../../components/elements/icons/CalculatorIcon'
import MoneyIcon from '../../../components/elements/icons/MoneyIcon'
// import printJS from 'print-js';
import { useReactToPrint } from 'react-to-print'
import { SET_SUCCESS } from '../../../store/types';
import ConfirmationBox from '../../../components/Layouts/ConfirmationBox';
import AppLayout from '../../../components/Layouts/AppLayout';
import ModalDialog from '../../../components/Layouts/ModalDialog';


const OrderDetails = () => {
    const navigate = useNavigate();
    const {orderId} = useParams();
    // const orderId = searchParams.get('orderId')
    const dispatch = useDispatch()
    const ordersState = useSelector((state => state.orders))
    const settingsState = useSelector((state => state.settings))
    const menusState = useSelector((state => state.menus))
    
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [setOrderAlias, setSetOrderAlias] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [confirmNavigation] = useState(false);
    // Prompt the user when they try to leave this route
    const handleBeforeUnload = (e) => {
        if (confirmNavigation) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Do you really want to leave?';
        }
    };

    // Add a beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    const [store, setStore] = useState(null);

    const [printing, setPrinting] = useState(false)
    const [billPrinting, setBillPrinting] = useState(false);

    useEffect(() => {
        const fetchStore = async() => {
            const store = await businessDetails()
            setStore(store)
        }

        const fetchOrderDetails = async () => {
            if(ordersState.deletedOrder !== null) {
                return
            }

            try {
                setLoaded(false)
                const headers = authHeader()
                const response = await axios.get(`${baseUrl}/orders/details/${orderId}?expand=table,customer`, { headers })

                await fetchOrderMenu(response.data.data.sourceMenu)
                setNewOrderDetails(response.data.data)

                setTimeout(() => {
                    setLoaded(true)
                }, 50);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        }

        const fetchOrderMenu = async (menuId) => {
            try {
                setLoaded(false)
                const headers = authHeader()
                const response = await axios.get(`${baseUrl}/menus/${menuId}?expand=items,items.item`, { headers })

                setActiveMenu(response.data.data)
                setActiveItems(response.data.data.items)

                setTimeout(() => {
                    setLoaded(true)
                }, 50);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        }

        setSearched(false)
        const fetchData = async () => {
            await Promise.all([
                fetchOrderDetails(),
                fetchStore(),
                dispatch(fetchMenus()),
                dispatch(fetchCategories('type=sale')),
                // dispatch(fetchItems('', 0, 0)),
                dispatch(fetchOrders('status=in_progress', 0, 0)),
                // dispatch(fetchStoreSettings())
            ])
            setLoaded(true)
        }

        fetchData()


        if(ordersState.createdOrder !== null){
            setSetOrderAlias(false)
            dispatch({
                type: SET_SUCCESS,
                payload: 'Order created/parked successfully!'
            })
            dispatch(clearCreatedOrder())
            dispatch(fetchOrders('status=pending', 0, 0))
            dispatch(fetchMenus())
        }

        if(ordersState.updatedOrder !== null){
            setSetOrderAlias(false)
            dispatch({
                type: SET_SUCCESS,
                payload: 'Order updated successfully!'
            })
            dispatch(clearUpdatedOrder())
            dispatch(fetchOrders('status=pending', 0, 0))
            dispatch(fetchMenus())
        }

        if(ordersState.deletedOrder !== null){
            setSetOrderAlias(false)
            dispatch({
                type: SET_SUCCESS,
                payload: 'Order deleted successfully!'
            })
            dispatch(clearDeletedOrder())
            navigate('/user/orders')
            dispatch(fetchOrders('', 1, 50))
        }

        if ((printing || billPrinting) && promiseResolveRef.current) {
            console.log("DOM ready. Resolving promise...");
            promiseResolveRef.current();
        }

    }, [refresh, ordersState.createdOrder, ordersState.updatedOrder, ordersState.deletedOrder, orderId, dispatch, navigate, printing, billPrinting]);

    const order = {
        alias: "",
        items: [],
        // total: "",
        createdBy: userDetails()._id
    }

    const [newOrderDetails, setNewOrderDetails] = useState(order);   

    const findItemIndexInOrder = (orderItems, itemId) => {
        return orderItems.findIndex(item => item.item === itemId);
    };
    
    const updateOrderQuantity = (itemIndex, type, quantity) => {
        setNewOrderDetails((prevOrder) => {
            const updatedOrder = { ...prevOrder };
            const orderItem = updatedOrder.items[itemIndex];

            switch (type) {
                case 'add':
                    orderItem.quantity += quantity;
                    deductItemCurrentStock(orderItem?.item, quantity)
                    break;
                case 'remove':
                    if (orderItem.quantity > quantity) {
                        orderItem.quantity -= quantity;
                    } else if (orderItem.quantity === quantity) {
                        updatedOrder.items.splice(itemIndex, 1);
                    }
                    increaseItemCurrentStock(orderItem?.item, quantity)
                    break;
                default:
                    break;
            }
    
            return updatedOrder;
        });
    };

    // const orderTotal = () => {
    //     const totalPrice = newOrderDetails?.items?.reduce((a, b) => a + (b.price * b.quantity || 0), 0)
    //     const vat = totalPrice * 0.075
    //     return {total: totalPrice, vat: vat}
    // }

    // const itemPriceMinusVat = (price) => {
    //     return (price / 1.075).toFixed(2)
    // }

    const deductItemCurrentStock = (itemId, quantity) => {
        const indexOfItem = activeItems.findIndex(menuItem => {return menuItem.item._id === itemId})
        let tempActiveItems = [...activeItems]
        tempActiveItems[indexOfItem].item.currentStock -= quantity
        setActiveItems(tempActiveItems)
    }

    const increaseItemCurrentStock = (itemId, quantity) => {
        const indexOfItem = activeItems.findIndex(menuItem => {return menuItem.item._id === itemId})
        let tempActiveItems = [...activeItems]
        tempActiveItems[indexOfItem].item.currentStock += quantity
        setActiveItems(tempActiveItems)
    }
    
    const addItemToOrder = (item) => {
        setNewOrderDetails((prevOrder) => {
            const updatedOrder = { ...prevOrder };
    
            const existingItemIndex = findItemIndexInOrder(updatedOrder.items, item.item._id);
    
            if (existingItemIndex !== -1) {
                updateOrderQuantity(existingItemIndex, 'add', 1);
            } else {
                const newItem = {
                    displayName: item.displayName,
                    item: item.item._id,
                    quantity: 1,
                    price: item.price
                };
                updatedOrder.items.push(newItem);
                deductItemCurrentStock(item.item._id, 1)
            }
            return updatedOrder;
        });
    };
    
    const parkOrder = async (alias, parkToPrint) => {
        try {
            let data = null
            if(newOrderDetails._id && newOrderDetails._id !== '') {
                data = newOrderDetails                
                dispatch(updateOrder(newOrderDetails._id, data));
            } else {
                data = {...newOrderDetails, ...{
                    alias: alias,  
                    status: 'IN_PROGRESS', 
                    paymentStatus: 'UNPAID', 
                    source: 'ONSITE',
                    sourceMenu: activeMenu._id,
                }}
                dispatch(createOrder(data))
            }

            if(!parkToPrint || parkToPrint === false) {
                setNewOrderDetails(order)
                setRefresh(refresh+1)
            }
        } catch (error) {
            console.error('Error parking order:', error);
        }
    }
    const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
    const [menuConfirmationMessage, setMenuConfirmationMessage] = useState(null);

    const [parkedOrderConfirmationMessage, setParkedOrderConfirmationMessage] = useState(null);
    const [parkedOrderToLoad, setParkedOrderToLoad] = useState(null);

    const loadParkedOrder = () => {
        selectMenu(menusState.menus?.menus[menusState?.menus?.menus.findIndex(menu => menu._id === parkedOrderToLoad.sourceMenu._id)])
        setNewOrderDetails(parkedOrderToLoad)
        setTimeout(() => {
            setParkedOrderToLoad(null)
            setParkedOrderConfirmationMessage(null)
        }, 100);
        setConfirmationBoxOpen(false)
    }

    const [activeItems, setActiveItems] = useState([]);
    const [menuToChange, setMenuToChange] = useState(null);
    const selectMenu = (menu) => {
        if(activeMenu === null ) {
            setActiveMenu(menu)
            setActiveItems(menu.items)
        } else {
            setMenuToChange(menu)
            setMenuConfirmationMessage("You are about to change the current active menu. Any active and unsaved orders will be cleared as one order cannot be made from multiple menus. Please park it first if you do not want to lose it.")
            setTimeout(() => {
                setConfirmationBoxOpen(true)
            }, 100);
        }
    }

    const switchMenu = () => {
        setActiveMenu(menuToChange)
        setActiveItems(menuToChange.items)
        setNewOrderDetails(order)
        setTimeout(() => {
            setMenuToChange(null)
        }, 100);
        setConfirmationBoxOpen(false)
    }

    const [orderDeleteConfirmationMessage, setOrderDeleteConfirmationMessage] = useState(null);
    const doDeleteOrder = async() => {
        setOrderDeleteConfirmationMessage(`You are about to permanently delete the order. This action cannot be reversed. Please confirm.`)
        setConfirmationBoxOpen(true)
    }

    const deleteOrderAfterConfirm = () => {
        try {
            dispatch(deleteOrder(newOrderDetails._id))
            setConfirmationBoxOpen(false)
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }
    

    const [createdOrder, setCreatedOrder] = useState(null);

    const startPayment = async () => {
        setCreatedOrder(newOrderDetails)
        setTimeout(() => {
            setPaymentModalOpen(true)
        }, 200);
    }

    const [paymentDetails, setPaymentDetails] = useState(null);


    const createPayment = async (paymentBody) => {
        try {
            // create the payment
            const currentUser = userDetails()
            const payment = {...paymentBody, ...{
                createdBy: currentUser._id,
                order: createdOrder._id
            }}

            setPaymentDetails(payment)

            const headers = authHeader()
            const store = await businessDetails()
            
            const requestPayload = {...payment, ...{store: store._id}}

            await axios.post(`${baseUrl}/transactions`, requestPayload, { headers })

            if(paymentBody.doReceiptPrint) {
                setPrinting(true)
                setTimeout(() => {
                    handlePrint()
                    // newHandlePrint()
                }, 100);
            } else {
                setPaymentModalOpen(false)
                setRefresh(refresh+1)
            }
            
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    }

    const componentRef = useRef()
    const promiseResolveRef = useRef();

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     bodyClass: 'print-class',
    //     documentTitle: `${storeDetails()} RECEIPT`,
    //     removeAfterPrint:true,
    //     onAfterPrint: () => {
    //       // Reset the Promise resolve so we can print again
    //     //   promiseResolveRef.current = null;
    //     //   setIsPrinting(false);
    //         setPrinting(false)
    //         setPaymentModalOpen(false)
    //         setRefresh(refresh+1)
    //         setActiveMenu(null)
    //         setNewOrderDetails(order)
    //     }
    // });

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        bodyClass: 'print-class',
        documentTitle: `${businessDetails()} RECEIPT`,
        removeAfterPrint: true,
        onBeforePrint: () => {
            return new Promise((resolve) => {
                console.log("Preparing to print receipt...");
                promiseResolveRef.current = resolve;
                setPrinting(true);
            });
        },
        onAfterPrint: () => {
            console.log("Printing completed.");
            promiseResolveRef.current = null;
            setPrinting(false);
            setPaymentModalOpen(false);
            setRefresh(refresh + 1);
            setActiveMenu(null);
            setNewOrderDetails(order);
        },
    });

    // const newHandlePrint = () => {
    //     printJS({ printable: componentRef.current, type: 'html', 
    //         // css: 'path/to/styles.css' 
    //     });
    //     setPrinting(false)
    //     setBillPrinting(false)
    // };

    const handleBillPrint = useReactToPrint({
        // content: () => componentRef.current,
        // bodyClass: 'print-class',
        // documentTitle: <span className='uppercase'>`{store?.name} BILL`</span>,
        // removeAfterPrint:true,
        // onAfterPrint: () => {
        //     setBillPrinting(false)
        //     setActiveItems(activeMenu.items)
        // }

        content: () => componentRef.current,
        bodyClass: 'print-class',
        documentTitle: <span className='uppercase'>`{store?.name} BILL`</span>,
        removeAfterPrint: true,
        onBeforePrint: () => {
            return new Promise((resolve) => {
                console.log("Preparing to print bill...");
                promiseResolveRef.current = resolve;
                setBillPrinting(true);
            });
        },
        onAfterPrint: () => {
            console.log("Printing completed.");
            promiseResolveRef.current = null;
            setBillPrinting(false)
            setActiveItems(activeMenu.items)
        },
    });

    const printReceipt = () => {
        if (componentRef.current) {
            setPrinting(true);
            setTimeout(() => {
                handlePrint();
            }, 1000);
        } else {
            console.error("Nothing to print. componentRef is null.");
        }
    }
   
    const printBill = async () => {
        await parkOrder(`Printed bill - ${(new Date()).getTime()}`, true)
        if (componentRef.current) {
            setPrinting(true);
            setTimeout(() => {
                handleBillPrint();
            }, 1000);
        } else {
            console.error("Nothing to print. componentRef is null.");
        }
    }

    const [searching] = useState(false);
    const [searched, setSearched] = useState(false);

    const clearSearch = () => {
        setLoaded(false)
        setActiveItems(activeMenu.items)
        setSearched(false)
        setTimeout(() => {
            setLoaded(true)
        }, 50);
    }

    const [leaveOrderConfirmationMessage] = useState(null);

    const confirmLeaveOrder = () => {
        navigate(-1)
    }

    const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);

    return (
        loaded ? <>
            <AppLayout>
            {
                <div className='min-h-screen h-inherit'>

                    <div className='w-full xl:w-10/12 2xl:w-8/12 mx-auto flex flex-row gap-x-5'>
                        <div className='w-full xl:w-5/12 pb-6 px-8 xl:px-12 pt-6'>
                            <div className='flex items-center gap-x-3'>
                                {/* {newOrderDetails?.source === 'online' && <div className='flex items-center'>
                                    
                                </div>} */}
                                <span className='inline-block w-max'>
                                    <OrderStatus status={newOrderDetails.status} />
                                </span>
                                <span className='inline-block w-max'>
                                    <OrderPaymentStatus status={newOrderDetails.paymentStatus} />
                                </span>
                                <span className='inline-block w-max'>
                                    {/* <OrderPaymentStatus status={newOrderDetails.source} /> */}
                                    {/* <div className='w-10 flex items-center justify-center h-10'>
                                        {newOrderDetails.source === 'ONLINE' && 
                                        <Tooltip title="Online order" placement="top">
                                            <div className='w-10 h-10 rounded-full bg-green-400 bg-opacity-10 flex items-center justify-center border border-green-400'>
                                                <GlobeIcon className={`w-5 h-5 text-green-500`} />
                                            </div>
                                        </Tooltip>
                                        }
                                        {newOrderDetails.source === 'ONSITE' && 
                                        <Tooltip title="On-site order" placement="top">
                                            <div className='w-10 h-10 rounded-lg bg-gray-600 bg-opacity-10 flex items-center justify-center border border-gray-400'>
                                                <StoreFrontIcon className={`w-5 h-5 text-gray-400`} />
                                            </div>
                                        </Tooltip>
                                        }
                                    </div> */}
                                </span>
                            </div>

                            {loaded && <div className='mt-5'>
                                <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>ORDER REF</label>
                                <h3 className='text-xl font-semibold mb-3 uppercase'>{newOrderDetails?.orderRef}</h3>
                                
                                <div className='rounded-md border bg-white border-gray-100 p-5 w-full '>

                                    <p className='font-medium text-gray-700 border-b w-full pb-2 mb-5 text-sm'>Customer</p>

                                    <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>NAME</label>
                                    <h3 className='text-xl font-semibold mb-3'>{newOrderDetails?.customer?.name}</h3>

                                    <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>EMAIL</label>
                                    <p className='text-sm mb-3'>{newOrderDetails?.customer?.email}</p>

                                    <label className='w-full block mb-1 text-[11px] tracking-[0.2em]'>PHONE</label>
                                    <p className='text-sm mb-3'>{newOrderDetails?.customer?.phone}</p>
                                </div>
                                <div className='rounded-md border bg-ss-pale-blue/50 border-blue-200 p-5 mt-5 w-full '>
                                    <p className='font-medium text-gray-700 border-b w-full pb-2 mb-2 text-sm'>Table</p>

                                    <h3 className='text-lg mb-1'>{newOrderDetails?.table?.name}</h3>
                                    <p className='text-sm text-gray-600'>{newOrderDetails?.table?.description}</p>
                                    
                                </div>
                                <div className='w-full mt-5 p-2.5'>
                                      <label className='w-full block mb-2 text-[11px] tracking-[0.2em]'>PAYMENT TYPE</label>
                                    <div className='flex items-center gap-x-2 mb-4'>
                                        {newOrderDetails?.paymentMethod === 'pos_on_delivery' && <CalculatorIcon className={`text-green-600 w-5 h-5`} />}
                                        {newOrderDetails?.paymentMethod === 'cash_on_delivery' && <MoneyIcon className={`text-green-500 w-5 h-5`} />}
                                        <p className='text-sm capitalize'>{unSlugify(newOrderDetails?.paymentMethod?.toLowerCase())}</p>
                                    </div>
                                </div>
                            </div>}
                            
                        </div>
                                

                        <div className='w-full xl:w-7/12 bg-white h-screen py-5'>

                            {newOrderDetails?.paymentStatus !== 'PAID' && <div className='w-full flex flex-row-reverse justify-between items-start p-4'>
                                <div className='flex items-center gap-x-2'>
                                    <button onClick={()=>{setUpdatingOrderStatus(true)}} className='w-max font-semibold flex items-center gap-x-3 justify-center bg-ss-dark-blue text-white transition duration-200 hover:bg-ss-black px-4 py-3 rounded-lg'>
                                        {/* <PrinterIcon className={`w-6 h-6`} /> */}
                                    Update order status
                                    </button>
                                    <Tooltip title="Cancel this order" placement="left">
                                        <button onClick={()=>{doDeleteOrder(orderId)}} className='p-3 border-2 rounded-lg border-gray-600 bg-gray-200 transition duration-200 hover:bg-gray-700 hover:text-white text-gray-600'><TrashIcon className={`w-5 h-5`} /></button>
                                    </Tooltip>
                                </div>
                            </div>}

                            <div className='relative w-full'>
                                {newOrderDetails?.items?.length > 0 ? <div className='w-full px-8 xl:px-5'>
                                    <h3 className='text-lg font-medium mb-4'>Items in this order</h3>
                                    {newOrderDetails.items && newOrderDetails.items.length > 0 && newOrderDetails.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className='flex flex-row gap-x-4 justify-between my-3 py-1 rounded border-b border-gray-300'>
                                            <div className='flex gap-x-2 items-start'>
                                                {newOrderDetails?.paymentStatus !== 'PAID' && <button onClick={()=>{updateOrderQuantity(itemIndex, 'remove', item.quantity)}} className='mt-1 rounded bg-gray-200 text-gray-700 p-1 transition duration-200 border border-gray-700 hover:bg-gray-400'><CloseIcon className="w-3 h-3" /></button>}
                                                <div>
                                                    <p className='font-medium text-sm'>{item.displayName}</p>
                                                    <p className='text-gray-500 text-sm'>₦{itemQuantityPriceMultiplier(settingsState?.settings, item.price)}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-x-2'>
                                                {newOrderDetails?.paymentStatus !== 'paid' &&<button onClick={()=>{updateOrderQuantity(itemIndex, 'remove', 1)}}  className='rounded bg-blue-700 text-white text-xl px-3 py-1 transition duration-200 border border-blue-700 hover:bg-blue-800'>-</button>}
                                                <input readOnly className='w-12.5 px-4 py-2 rounded border border-gray-400 focus:border-gray-600 transition duration-200' value={item.quantity} />
                                                {newOrderDetails?.paymentStatus !== 'paid' &&<button onClick={()=>{updateOrderQuantity(itemIndex, 'add', 1)}} className='rounded bg-blue-700 text-white text-xl px-3 py-1 transition duration-200 border border-blue-700 hover:bg-blue-800'>+</button>}
                                            </div>
                                        </div>
                                    ))}
                                    {newOrderDetails.items && newOrderDetails.items.length > 0 && 
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
                                                <p className='font-medium text-sm'>{orderTotal(newOrderDetails, settingsState.settings).vat.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    }

                                    
                                </div>
                                : 
                                <p className='text-center px-8 text-gray-400'>Select some items from the left to begin a new order</p>
                                }
                            </div>

                            {newOrderDetails?.items?.length > 0 && <div className='w-full mt-12 pb-12'>

                                <div className='w-full flex justify-between items-center p-2.5'>
                                    <div className='flex items-center gap-x-4'>
                                        {newOrderDetails?.paymentStatus !== 'PAID' && <div className='flex items-center'>
                                            <button onClick={()=>{printBill()}} className='rounded-lg h-12.5 px-4 font-semibold flex items-center gap-x-2 justify-center bg-ss-pale-blue border-2 border-ss-dark-blue text-ss-dark-blue transition duration-200 hover:bg-blue-300 cursor-pointer'>
                                                <PrinterIcon className={`w-6 h-6`} />
                                                Print Receipt
                                            {/* Print Bill  */}
                                            </button>
                                        </div>}
                                        {/* <Tooltip title="Apply discount/promotion" placement="top-start">
                                            <button className='p-2 border-2 rounded-md border-gray-600 bg-gray-200 transition duration-200 hover:bg-gray-700 hover:text-white text-gray-600'><DealsIcon className={'w-6 h-6'} /></button>
                                        </Tooltip>
                                        <Tooltip title="Add amount" placement='top-start'>
                                            <button className='p-2 border-2 rounded-md border-gray-600 bg-gray-200 transition duration-200 hover:bg-gray-700 hover:text-white text-gray-600'><PlusIcon className={`w-6 h-6`} /></button>
                                        </Tooltip> */}
                                    </div>

                                    {/* <h3 className='font-courier-prime text-5xl text-gray-600'>{orderTotal}</h3> */}
                                    <h3 className='font-courier-prime text-3xl text-gray-600 pr-2.5'><span className='text-sm'>NGN </span>{orderTotal(newOrderDetails, settingsState?.settings)?.total?.toLocaleString()}</h3>
                                </div>
                                {(!newOrderDetails?.paymentStatus || newOrderDetails?.paymentStatus === 'unpaid') && <div className='px-2.5 flex items-center gap-x-2.5'>
                                    <Tooltip title="Park order for later" placement="top-start">
                                        <button onClick={()=>{setSetOrderAlias(true)}} className='rounded-lg h-18.75 w-25 flex items-center gap-x-3 justify-center bg-green-400 text-green-800 font-light transition duration-200 hover:bg-green-800 hover:text-white'>
                                            <BookmarkIcon className={`w-6 h-6`} />
                                            {/* Receive payment &amp; close order  */}
                                        </button>
                                    </Tooltip>
                                    <button onClick={()=>{startPayment()}} className='rounded-lg h-18.75 w-full flex items-center gap-x-3 justify-center bg-green-600 text-white font-light transition duration-200 hover:bg-green-700'>
                                        <CheckIconCircled className={`w-6 h-6`} />
                                        Receive payment &amp; close order 
                                    </button>
                                </div>}
                                {newOrderDetails?.paymentStatus === 'PAID' && <div className='flex items-center px-5'>
                                    <button onClick={()=>{printReceipt()}} className='h-16.25 w-full flex items-center gap-x-3 justify-center bg-green-500 text-white font-semibold transition duration-200 hover:bg-green-800 rounded-lg'>
                                        <PrinterIcon className={`w-6 h-6`} />
                                       Print receipt 
                                    </button>
                                </div>}
                                <div className="">
                                    <br />
                                    <br />
                                </div>
                            </div>}
                        </div>
                    </div>

                    {(printing || billPrinting) && <div className='' ref={componentRef}>
                        <div style={{marginBottom: '10px', fontFamily: 'Outfit, sans-serif'}}>
                        
                            <div>
                                <h3 style={{fontSize: '12px', lineHeight: '12px', marginBottom: '1px', fontWeight: 500}}>Elevana - {store?.name}</h3>
                                <p style={{fontSize: '8px', marginBottom: '10px'}}>
                                {store?.address}, {store?.city}, {store?.state}.
                                </p>
                            </div>
                        </div>
                        <br />
                        <h3 style={{fontSize: '10px', marginBottom: '10px', fontWeight: 500}}>Bill - {new Date().toDateString()}</h3>
                        <hr />

                        {newOrderDetails.items && newOrderDetails.items.length > 0 && newOrderDetails.items.map((item, itemIndex) => (
                            <div key={itemIndex} style={{margin: '0px 10px'}}>
                                <p style={{fontSize: '8px'}}>(x{item.quantity}) {item.displayName.split(') ')[1]} - ₦{(item.quantity * itemQuantityPriceMultiplier(settingsState?.settings, item.price)).toFixed(2).toLocaleString()}</p>
                            </div>
                        ))}
                        {settingsState?.settings?.taxes && settingsState?.settings?.taxes?.enabled && <div className='flex flex-row gap-x-4 justify-between my-3 py-1 rounded'>
                            <div className='w-6/12'>
                                <p className='font-medium text-[8px]'>VAT ({settingsState?.settings?.taxes?.rate}%)</p>
                                {/* <p className='text-gray-500 text-[10px]'>₦{orderTotal().vat}</p> */}
                            </div>
                            <div className='w-3/12'>
                                {/* <p className='text-[10px]'>{item.quantity}</p> */}
                            </div>
                            <div className='w-3/12'>
                                <p className='text-[8px]'>₦{orderTotal(newOrderDetails, settingsState.settings).vat.toLocaleString()}</p>
                            </div>
                        </div>}

                        <p style={{fontSize: '8px', marginBottom: '10px'}}>Total: <span className='font-[550] text-[10px]'>₦{orderTotal(newOrderDetails, settingsState.settings).total.toLocaleString()}</span></p>
                        
                        <hr />
                        
                        {printing && <p style={{fontSize: '8px'}}>Payment channel: {paymentDetails?.channel}</p>}
                        <p style={{fontSize: '8px', marginBottom: '10px'}}>Processed by: {userDetails()?.name}</p>
                        {/* <h3 className='text-[10px] text-black'><span className='text-sm'>₦</span>{orderTotal(newOrderDetails, settingsState.settings).total.toLocaleString()}</h3> */}
                        {printing && <p style={{fontSize: '8px', marginBottom: '10px'}}>Thanks for your patronage</p>}

                    </div>}
                </div>
            }
            </AppLayout>

            <ModalDialog
                shown={updatingOrderStatus} 
                closeFunction={()=>{setUpdatingOrderStatus(false)}} 
                dialogTitle='Update status for this order'
                dialogIntro={`Use the dropdown below to change the status of this order`}
                maxWidthClass='max-w-md'
            >
                <UpdateOrderStatus 
                    cancel={()=>{setUpdatingOrderStatus(false)}} 
                    currentStatus={newOrderDetails.status} 
                    orderId={newOrderDetails._id} 
                />
            </ModalDialog>

            <ModalDialog
                shown={setOrderAlias} 
                closeFunction={()=>{setSetOrderAlias(false)}} 
                dialogTitle='Set an alias for this order'
                dialogIntro={`Name this order before parking it for easy reference`}
                maxWidthClass='max-w-md'
            >
                <SetOrderAlias cancel={()=>{setSetOrderAlias(false)}} tempOrderAlias={`${(new Date()).getTime()} - ${newOrderDetails?.items?.reduce((a, b) => a + (b.price * b.quantity || 0), 0)}`} parkOrder={(alias)=>{parkOrder(alias)}} />
            </ModalDialog>

            <ModalDialog
                shown={paymentModalOpen} 
                closeFunction={()=>{setPaymentModalOpen(false)}} 
                dialogTitle='Payment details'
                maxWidthClass='max-w-md'
            >
                <ReceivePayment 
                    storeSettings={settingsState?.settings}
                    paymentAmount={orderTotal(newOrderDetails, settingsState?.settings)?.total} 
                    closeTransaction={()=>{setPaymentModalOpen(false)}} 
                    receivePayment={(payload)=>{createPayment(payload)}}
                />
            </ModalDialog>

            {menuConfirmationMessage && <ConfirmationBox
                isOpen={confirmationBoxOpen} 
                closeModal={()=>{setConfirmationBoxOpen(false)}} 
                confirmButtonAction={()=>{switchMenu()}}                          
            >
                <p>{menuConfirmationMessage}</p>
            </ConfirmationBox>}

            {parkedOrderConfirmationMessage && <ConfirmationBox
                isOpen={confirmationBoxOpen} 
                closeModal={()=>{setConfirmationBoxOpen(false)}} 
                confirmButtonAction={()=>{loadParkedOrder()}}                          
            >
                <p>{parkedOrderConfirmationMessage}</p>
            </ConfirmationBox>}

            {orderDeleteConfirmationMessage && <ConfirmationBox
                isOpen={confirmationBoxOpen} 
                closeModal={()=>{setConfirmationBoxOpen(false)}} 
                confirmButtonAction={()=>{deleteOrderAfterConfirm()}}                          
            >
                <p>{orderDeleteConfirmationMessage}</p>
            </ConfirmationBox>}

            {leaveOrderConfirmationMessage && <ConfirmationBox
                isOpen={confirmationBoxOpen} 
                closeModal={()=>{setConfirmationBoxOpen(false)}} 
                confirmButtonAction={()=>{confirmLeaveOrder()}}                          
            >
                <p>{leaveOrderConfirmationMessage}</p>
            </ConfirmationBox>}
        </>
        
        : 

        // <InlinePreloader />
        <Loader />
    )
}

export default OrderDetails