import React, { useEffect, useState } from 'react'
import { tableHeadersFields } from '../../../utils'
import DataTable from '../DataTable'
import Currency from '../Currency'
import OrderPaymentStatus from '../orders/OrderPaymentStatus'
import OrderExpansion from '../orders/OrderExpansion'
import OrderStatus from '../OrderStatus'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../../../store/actions/ordersActions'
import OrderSummary from '../orders/OrderSummary'

const RecentOrders = () => {

  const [refresh] = useState(0);
  const dispatch = useDispatch()
  const ordersState = useSelector((state => state.orders))
  const [page] = useState(1);
  const [perPage] = useState(5);

  useEffect(() => {
    dispatch(fetchOrders('paymentStatus=paid&&paymentMethod=cash_on_delivery,pos_on_delivery', page, perPage))

    return () => {
    
    };
  }, [dispatch, page, perPage, refresh]);

  const columnWidths = {
    // id: "w-full lg:w-1/12",
    orderAlias: "w-full lg:w-3/12",
    sourcePriceCard: "w-full lg:w-2/12",
    items: "w-full lg:w-2/12",
    status: "w-full lg:w-2/12",
    value: "w-full lg:w-2/12",
    payment: "w-full lg:w-1/12",
}

const cleanupData = (dataSet) => {
    const data = []
    dataSet?.forEach((item, itemIndex) => {
    data.push(
        {
            orderAlias: <OrderSummary item={item} />,
            sourcePriceCard: item.sourceMenu?.name,
            items: `${item.items?.length || 0} items in order`,
            status: <OrderStatus status={item.status} />,
            value: <Currency amount={item.total || 0}/>,
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
    <div className='w-full' style={{minHeight: '380px', height: 'inherit'}}>
      {!ordersState.fetchingOrders && <DataTable
        tableHeaders={tableHeadersFields(cleanupData(ordersState.orders?.orders)[0]).headers} 
        tableData={cleanupData(ordersState.orders?.orders)} 
        columnWidths={columnWidths}
        columnDataStyles={{}}
        allFields={tableHeadersFields(cleanupData(ordersState.orders?.orders)[0]).fields}
        onSelectItems={()=>{}}
        tableOptions={tableOptions}
        // pagination={{
        //     perPage: 25, 
        //     currentPage: 1,
        //     totalItems: 476,
        // }}
        // changePage={()=>{}}
        // updatePerPage={()=>{}}
        expandedIndex={rowOpen || ''}
        expansion={<OrderExpansion orders={ordersState.orders?.orders} rowOpen={rowOpen} />}
      />}
    </div>
  )
}

export default RecentOrders