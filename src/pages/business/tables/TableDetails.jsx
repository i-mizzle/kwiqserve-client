import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import { useDispatch, useSelector } from 'react-redux'
import { ERROR } from '../../../store/types'
import { authHeader, baseUrl, slugify, tableHeadersFields } from '../../../utils'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../../components/elements/Loader'
import ArrowDownTrayIcon from '../../../components/elements/icons/ArrowDownTrayIcon'
import { fetchOrders } from '../../../store/actions/ordersActions'
import OrderExpansion from '../../../components/elements/orders/OrderExpansion'
import DataTable from '../../../components/elements/DataTable'
import Currency from '../../../components/elements/Currency'
import ArrowNarrowRight from '../../../components/elements/icons/ArrowNarrowRight'
import OrderSummary from '../../../components/elements/orders/OrderSummary'
import OrderStatus from '../../../components/elements/orders/OrderStatus'
import OrderPaymentStatus from '../../../components/elements/orders/OrderPaymentStatus'
import EmptyState from '../../../components/elements/EmptyState'

const TableDetails = () => {
  const [tableDetails, setTableDetails] = useState({})
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const ordersSelector = useSelector(state => state.orders)
  const {tableId} = useParams()

  useEffect(() => {
    dispatch(fetchOrders(`table=${tableId}`, 1, 20))
    const getTableDetails = async () => {
      try {
        setLoading(true)
        const headers = authHeader()
        const response = await axios.get(`${baseUrl}/tables/${tableId}?expand=menu,createdBy`, headers)
        setTableDetails(response.data.data)
        setLoading(false)
      } catch (error) {
        dispatch({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    }
    getTableDetails()
  
    return () => {
      
    }
  }, [])

  const handleDownload = async(url) => {
    // URL of the file to download
    const fileUrl = url;
    const fileName = `table-qr-${slugify(tableDetails.code)}`; // Optional custom filename

    try {
        // Fetch the file as a blob
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = fileName;

      // Append and trigger the download
      document.body.appendChild(anchor);
      anchor.click();

      // Cleanup
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

    const columnWidths = {
        // id: "w-full lg:w-1/12",
        orderAlias: "w-full lg:w-5/12",
        // table: "w-full lg:w-2/12",
        items: "w-full lg:w-1/12",
        status: "w-full lg:w-2/12",
        value: "w-full lg:w-2/12",
        payment: "w-full lg:w-2/12",
    }

    const cleanupData = (dataSet) => {
        const data = []
        if (!dataSet) return []

        dataSet.forEach((item, itemIndex) => {
        data.push(
            {
                orderAlias: <OrderSummary item={item} />,
                // table: item.table?.name,
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
  
  
  return (
    <AppLayout>
      {loading ? 
        <Loader />
        :
        <div className='w-full relative pt-12'>
          <div className='w-full 2xl:w-10/12 mx-auto pb-6 px-3 xl:flex items-start gap-x-5'>
            <div className='w-full xl:w-9/12'>
              <div className='w-full flex items-start gap-x-5 pb-12'>
                <div className='w-1/2'>
                  <h3 className='font-medium text-xl'>{tableDetails.name}</h3>
                  <h3 className='uppercase tracking-[0.5em] text-sm mb-2'>{tableDetails.code}</h3>
                  <div className='h-12.5'>
                    <p className='text-sm text-gray-500 mb-4'>{tableDetails.description}</p>

                    <h3 className='uppercase tracking-[0.5em] text-xs mb-1'>created by</h3>
                    <p className='text-sm text-gray-500 mb-4'>{tableDetails.createdBy.name}</p>

                    <h3 className='uppercase tracking-[0.5em] text-xs mb-1'>table menu</h3>
                    <p className='text-sm text-gray-500'>{tableDetails.menu.name}</p>
                    <Link to={`/business/menus/menu/${tableDetails.menu._id}`} className='flex items-center gap-x-2 transition text-gray-400 text-xs duration-200'>
                      See Menu Details <ArrowNarrowRight className={`w-4 h-4`} />
                    </Link>

                  </div>
                </div>
                <div className='w-1/2'>
                  <h3 className='uppercase tracking-[0.5em] text-xs mb-1'>table revenue today</h3>
                  <h1 className='text-3xl font-bold mb-1 pb-1 border-b border-gray-300'>N{tableDetails.orders.today.total.toLocaleString()}</h1>
                  <p className='text-gray-500 text-sm'>From {tableDetails.orders.today.count.toLocaleString()} Orders</p>

                  <h3 className='uppercase tracking-[0.5em] text-xs mt-6 mb-2'>total table revenue</h3>
                  <h1 className='text-3xl font-bold mb-1 pb-1 border-b border-gray-300'>N{tableDetails.orders.total.total.toLocaleString()}</h1>
                  <p className='text-gray-500 text-sm'>From {tableDetails.orders.total.count.toLocaleString()} Orders</p>
                </div>
              </div>

              <div className='w-full pt-10 mb-6'>
                <h1 className='text-xl font-bold text-ss-dark-gray'>Recent Orders for this table</h1>
                <p className='text-gray-500 text-sm'>Latest orders placed on this table, you can click on an order to see more details and update order statuses</p>
              </div>

              {ordersSelector?.fetchingOrders ?     

                <Loader /> : 

                <div className='w-full'>
                  <div className='hidden xl:block'>
                    {ordersSelector.orders.orders?.length > 0 ?
                      <DataTable
                        tableHeaders={tableHeadersFields(cleanupData(ordersSelector.orders?.orders)[0]).headers} 
                        tableData={cleanupData(ordersSelector.orders?.orders)} 
                        columnWidths={columnWidths}
                        columnDataStyles={{}}
                        allFields={tableHeadersFields(cleanupData(ordersSelector.orders?.orders)[0]).fields}
                        onSelectItems={()=>{}}
                        tableOptions={tableOptions}
                        expandedIndex={rowOpen || ''}
                        expansion={<OrderExpansion orders={ordersSelector.orders?.orders} rowOpen={rowOpen} />}
                      />
                      :
                      <EmptyState emptyStateText={`No orders have been created for this table yet`} emptyStateTitle={`No Orders Found`} />
                    }
                  </div>

                  <div className='block xl:hidden'>
                        {ordersSelector.orders?.orders?.map((order, orderIndex) => (
                            <Link to={`/business/orders/order/${order._id}`} key={orderIndex} className='w-full block relative mb-5 gap-x-2.5 bg-white my-2.5 rounded-lg shadow-xl shadow-green-500/5'>
                                
                                <div className='flex items-end justify-between gap-x-2.5 border-b p-5'>
                                    {/* <OrderSummary item={order} /> */}
                                    <div className='w-full flex items-center gap-x-2.5'>
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
            <div className='w-full xl:w-3/12 p-5 border-2 rounded border-gray-200 xl:sticky top-10 z-1'>
              <h3 className='uppercase tracking-[0.5em] text-xs mb-2'>table qr code</h3>
              <p className='text-sm text-gray-500'>You can download ths qr code, print and place it around your physical store for your customers to scan and immediately access your price cards</p>
              {tableDetails.tableQrCode && tableDetails.tableQrCode !== '' ? 
              <div className='w-full my-5'>
                  <img alt='' src={tableDetails.tableQrCode} className='max-w-full mx-auto w-full'/>
                  <button onClick={()=>{handleDownload(tableDetails.tableQrCode)}} className='cursor-pointer flex mx-auto items-center gap-x-1.25 font-space-grotesk font-[550] text-ss-dark-blue transition duration-200 hover:text-ss-black text-[12px] mt-5'>
                      <ArrowDownTrayIcon className={`w-5 h-5`} />
                      Download QR Code
                  </button>
              </div>
              :
              <div className='w-full my-10 bg-gray-50 p-5'>
                <h3 className='text-xl'>QrCode pending</h3>
                <p className='text-sm text-gray-500 mt-2'>QR Code is being generated in the background, please check back later.</p>
              </div>
              }
            </div>

            

          </div>
        </div>
      }
    </AppLayout>
  )
}

export default TableDetails