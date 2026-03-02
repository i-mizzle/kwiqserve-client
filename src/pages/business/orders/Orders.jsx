import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import Filters from '../../../components/elements/Filters'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../../../store/actions/ordersActions'
import Loader from '../../../components/elements/Loader'
import DataTable from '../../../components/elements/DataTable'
import OrderExpansion from '../../../components/elements/orders/OrderExpansion'
import { Link } from 'react-router-dom'
import { tableHeadersFields } from '../../../utils'
import OrderSummary from '../../../components/elements/orders/OrderSummary'
import OrderStatus from '../../../components/elements/orders/OrderStatus'
import OrderPaymentStatus from '../../../components/elements/orders/OrderPaymentStatus'
import Currency from '../../../components/elements/Currency'
import EmptyState from '../../../components/elements/EmptyState'

const Orders = () => {
        const usersState = useSelector((state => state.users))
    const dispatch = useDispatch()
    // const statsState = useSelector((state => state.stats))
    const ordersState = useSelector((state => state.orders))
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(50);
    const [filters, setFilters] = useState('paymentStatus=paid&&paymentMethod=cash_on_delivery,pos_on_delivery');

    useEffect(() => {
        const fetchData = async () => {
            // const fetchOrderStats = () => {
            //     if(hasPermissions(['*', 'reports.*', 'reports.read'])){
            //         dispatch(fetchStats())
            //     }
            // }
            await Promise.all([
                dispatch(fetchOrders(filters, currentPage, perPage)),
                // dispatch(fetchUsers('', 0, 0)),
                // fetchOrderStats()
                
            ])
            // setLoaded(true)
        }

        fetchData()

        return () => {
          
        };
    }, [currentPage, perPage, filters, dispatch]);

    const columnWidths = {
        // id: "w-full lg:w-1/12",
        orderAlias: "w-full lg:w-4/12",
        table: "w-full lg:w-2/12",
        items: "w-full lg:w-1/12",
        status: "w-full lg:w-2/12",
        value: "w-full lg:w-2/12",
        payment: "w-full lg:w-1/12",
    }

    const cleanupData = (dataSet) => {
        const data = []
        if (!dataSet) return []

        dataSet.forEach((item, itemIndex) => {
        data.push(
            {
                orderAlias: <OrderSummary item={item} />,
                table: item.table?.name,
                items: `${item.items?.length || 0} items`,
                status: <OrderStatus status={item.status} />,
                value: <Currency amount={item.total || 0} vat={item.vat !== 0 && item.vat}/>,
                payment: <OrderPaymentStatus status={item.paymentStatus} />,
            },
        )
        })

        return data
    }

    const [rowOpen, setRowOpen] = useState(null)

    const toggleRowOpen = (rowIndex) => {
        if(rowOpen === null) {
            setRowOpen(rowIndex)
        } else {
            setRowOpen(null)
        }
    } 

    const tableOptions = {
        selectable: false,
        expandable: true,
        clickableRows: true,
        rowAction: (value)=>{toggleRowOpen(value)}
    }


    const filterOptions = [
        {
            name: 'marketplace',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ['Primary', 'Secondary'],
            valueLabel: 'value',
            value: "",
            displayValue: ""
        },
        {
            name: 'Status',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ['IN_PROGRESS', 'COMPLETED', 'PREPARING_ORDER', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
            valueLabel: 'status',
            value: "",
            displayValue: ""
        },
        {
            name: 'Payment Status',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ['UNPAID', 'PART_PAID', 'PAID'],
            valueLabel: 'paymentStatus',
            value: "",
            displayValue: ""
        },
        {
            name: 'Processed by',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: usersState?.users?.users,
            optionLabelName: 'name',
            optionValueName: '_id',
            valueLabel: 'createdBy',
            value: "",
            displayValue: ""
        },
        {
            name: 'Order type',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ['ONLINE', 'ONSITE'],
            valueLabel: 'type',
            value: "",
            displayValue: ""
        },
        {
            name: 'Total',
            linkType: 'option',
            link: ['is greater than', 'is less than'],
            type: 'number',
            valueLabelOptions: {
                'is greater than': 'minTotal',
                'is less than': 'maxTotal',
            },
            valueLabel: 'total',
            value: "",
            toValue: "",
            displayValue: ""
        },
        {
            name: 'Date',
            linkType: 'option',
            link: ['is after', 'is before'],
            type: 'date',
            valueLabel: 'createdAt',
            valueLabelOptions: {
                'is after': 'minDate',
                'is before': 'maxDate',
            },
            value: "",
            toValue: "",
            displayValue: ""
        }
    ]
    return (
        <AppLayout>
            <>
                <div className='min-h-screen h-inherit'>
                    <div className='w-full xl:flex flex-row gap-x-8'>
                        <div className={`w-full pb-6 px-3 xl:px-12 mt-4`}>
                            <div className='lg:flex justify-between items-center mt-4 mb-4'>
                                <div>
                                    <h1 className='text-3xl font-bold text-ss-dark-gray'>Orders <span className='text-[14px] font-normal'>({ordersState.orders?.total || '0'} orders)</span></h1>
                                    <p className='text-gray-500 text-sm'>Manage orders in your business. Click on an order view details or edit status</p>
                                </div>

                                <div className='lg:flex w-full lg:w-1/2 flex-row-reverse gap-x-3 mt-5 lg:mt-0'>
                                    {/* <Link to={`new-order`}>
                                        <button className='flex w-full lg:w-max gap-x-2 items-center justify-center bg-green-500 border border-green-500 px-[16px] py-[12px] rounded-[8px] text-white transition duration-200 hover:bg-green-800 font-[550]'>
                                            <PlusIcon className={`h-5 w-5`} />
                                            Start a new Order
                                        </button>
                                    </Link> */}
                                </div>

                            </div>

                            <div className='w-full flex items-start justify-between my-8'>
                                <div className='w-full'>
                                    <Filters filterOptions={filterOptions} returnSelected={(selectedFilters)=>{setFilters(selectedFilters)}} />
                                </div>
                                <div className=' flex flex-row-reverse w-2/12'>
                                    {/* <button onClick={()=>{getOrdersCsv()}} className='w-[300px] rounded border border-ss-dark-blue bg-gray-100 px-3 py-2 text-sm text-ss-dark-blue flex items-center justify-center'>
                                        {fetchingCsv ? <InlinePreloader /> : 
                                        <span className='flex items-center justify-center gap-x-3'><ExportImportIcon className={`w-5 h-5 transform rotate-180`}/> Export Orders</span>
                                        }
                                    </button> */}
                                </div>
                            </div>

                            {ordersState.fetchingOrders ? 
                    
                                <Loader /> : 

                                <div className='w-full'>
                                    <div className='hidden xl:block'>
                                    {ordersState?.orders?.orders?.length > 0 ?

                                        <DataTable
                                            tableHeaders={tableHeadersFields(cleanupData(ordersState.orders?.orders)[0]).headers} 
                                            tableData={cleanupData(ordersState.orders?.orders)} 
                                            columnWidths={columnWidths}
                                            columnDataStyles={{}}
                                            allFields={tableHeadersFields(cleanupData(ordersState.orders?.orders)[0]).fields}
                                            onSelectItems={()=>{}}
                                            tableOptions={tableOptions}
                                            pagination={{
                                                perPage: perPage, 
                                                currentPage: currentPage,
                                                totalItems: ordersState.orders?.total,
                                            }}
                                            changePage={setCurrentPage}
                                            updatePerPage={setPerPage}
                                            expandedIndex={rowOpen || ''}
                                            expansion={<OrderExpansion orders={ordersState.orders?.orders} rowOpen={rowOpen} />}
                                        />
                                         :
                                        <EmptyState emptyStateText={`No orders have been created for this table yet`} emptyStateTitle={`No Orders Found`} />
                                        }
                                    </div>

                                    <div className='block xl:hidden'>
                                        {ordersState.orders?.orders?.map((order, orderIndex) => (
                                            <Link to={`single/${order._id}`} key={orderIndex} className='w-full block relative mb-5 gap-x-2.5 bg-white my-2.5 rounded-lg shadow-xl shadow-green-500/5'>
                                                
                                                <div className='flex items-end justify-between gap-x-2.5 border-b p-5'>
                                                    {/* <OrderSummary item={order} /> */}
                                                    <div className='w-full flex items-center gap-x-2.5'>
                                                        <div className='w-15 flex items-center justify-center h-15'>
                                                            {order.source === 'ONLINE' && 
                                                            <Tooltip title="Online order" placement="top">
                                                                <div className='w-15 h-15 rounded-lg bg-green-400 bg-opacity-10 flex items-center justify-center'>
                                                                    <GlobeIcon className={`w-5 h-5 text-green-500`} />
                                                                </div>
                                                            </Tooltip>
                                                            }
                                                            {order.source === 'ONSITE' && 
                                                            <Tooltip title="On-site order" placement="top">
                                                                <div className='w-15 h-15 rounded-lg bg-gray-400 bg-opacity-20 flex items-center justify-center'>
                                                                    <StoreFrontIcon className={`w-5 h-5 text-gray-400`} />
                                                                </div>
                                                            </Tooltip>
                                                            }
                                                        </div>
                                                        <div className='w-full'>
                                                            <p className='font-medium text-gray-700 font-space-grotesk'>{order.alias}</p>
                                                            <p className='text-sm mb-2.5 text-gray-500'>{order.items?.length || 0} items in order from {order.sourceMenu?.name}</p>
                                                            <div className='flex items-center gap-x-2.5'>
                                                                <OrderStatus status={order.status} />
                                                                <OrderPaymentStatus status={order.paymentStatus} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between px-5 py-2.5 bg-green-50 bg-opacity-20'>
                                                    <p className='text-xs text-gray-600'>{new Date(order?.createdAt).toDateString()} - {new Date(order?.createdAt).toLocaleTimeString()}</p>
                                                    <Currency amount={order.total || 0} vat={order.vat !== 0 && order.vat}/>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                            }

                        </div>
                    </div>
                </div> 
            </>
        </AppLayout>
    )
}

export default Orders