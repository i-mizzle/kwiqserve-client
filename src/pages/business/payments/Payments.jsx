import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import ArrowIcon from '../../../components/elements/icons/ArrowIcon'
import OrderStatus from '../../../components/elements/orders/OrderStatus'
import Currency from '../../../components/elements/Currency'
import ErrorMessage from '../../../components/elements/ErrorMessage'
import SearchField from '../../../components/elements/SearchField'
import Filters from '../../../components/elements/Filters'
import InlinePreloader from '../../../components/elements/InlinePreloader'
import ArrowUpTrayIcon from '../../../components/elements/icons/ArrowUpTrayIcon'
import CloseIcon from '../../../components/elements/icons/CloseIcon'
import { debounce, tableHeadersFields } from '../../../utils'
import DataTable from '../../../components/elements/DataTable'
import Pagination from '../../../components/elements/Pagination'
import ModalDialog from '../../../components/Layouts/ModalDialog'
import TransactionDetails from '../../../components/elements/payments/TransactionDetails'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../../../store/actions/usersActions'
import { fetchOrders } from '../../../store/actions/ordersActions'
import { fetchTransactions } from '../../../store/actions/transactionsActions'
import EmptyState from '../../../components/elements/EmptyState'

export const transactionColumnWidths = {
    transactionReference: 'w-2/12',
    order: 'w-2/12',
    status: 'w-1/12',
    channel: 'w-1/12',
    receivedBy: 'w-2/12',
    amount: 'w-2/12',
    timeStamp: 'w-2/12',
}

const Payments = () => {
    const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
    const [activeDialogTransaction, setActiveDialogTransaction] = useState(null)
    const [error, setError] = useState('')  
    const [perPage, setPerPage] = useState(50)
    const [currentPage, setCurrentPage] = useState(1)

    const updatePerPage = (count) => {
        setPerPage(count)
    }

    const updateCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const [refresh, setRefresh] = useState(0);
    const [loaded, setLoaded] = useState(true);

    const dispatch = useDispatch()
    const transactionsState = useSelector((state => state.transactions))
    const usersState = useSelector((state => state.users))
    const ordersState = useSelector((state => state.orders))

    const [filters, setFilters] = useState('');

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchOrders('paymentStatus=paid', 0, 0))
        setSearched(false)
        dispatch(fetchTransactions(filters, currentPage, perPage))

    }, [refresh, filters, currentPage, perPage, dispatch]);

    const TransactionLink = ({type, reference, index}) => {
        return (
            <div className='w-full flex items-center gap-x-2.5'>
                <div className='w-6'>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${type === 'inflow' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <ArrowIcon className={`w-4 h-4 ${type === 'inflow' ? 'text-green-600 rotate-135' : 'text-red-600 -rotate-45'}`} />
                    </div>
                </div>
                <button className='text-gray-500 font-medium' onClick={() => {openTransaction(index)}}>{reference}</button>
            </div>
        )
    }

    const cleanupData = (dataSet) => {
        const data = []
        if(!dataSet) return []
        dataSet.forEach((item, itemIndex) => {
            data.push(
                {
                    transactionReference: <TransactionLink type={item.order ? 'inflow' : 'outflow'} reference={item.transactionReference} index={itemIndex} />,
                    order: item?.order?.alias || `${item?.subscriptionPlan?.name} plan subscription`,
                    status: <OrderStatus status={item.status} />,
                    channel: item.channel,
                    receivedBy: item.createdBy?.name,
                    amount: <Currency amount={item.amount}/>,
                    timeStamp: `${new Date(item?.createdAt).toDateString()} - ${new Date(item?.createdAt).toLocaleTimeString()}`
                },
            )
        })
    
        return data
    }

    const openTransaction = (transactionIndex) => {
        setTransactionDialogOpen(true)
        setActiveDialogTransaction(transactionIndex)
    }

    const closeTransaction = () => {
        setTransactionDialogOpen(false)
        setActiveDialogTransaction(null)
    }
    
    const tableOptions = {
        selectable: false
    }

    const columnDataStyles = {}

    const [selectedUsersCount, setSelectedUsersCount] = useState();
    const getSelectionCount = (count) => {
        return setSelectedUsersCount(count)
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
            name: 'Channel',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ['cash', 'pos', 'transfer', 'web'],
            valueLabel: 'channel',
            value: "",
            displayValue: ""
        },
        {
            name: 'Received by',
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
            name: 'Order',
            linkType: 'text',
            link: 'is',
            type: 'binary',
            options: ordersState?.orders?.orders,
            optionLabelName: 'alias',
            optionValueName: '_id',
            valueLabel: 'createdBy',
            value: "",
            displayValue: ""
        },
        {
            name: 'Amount',
            linkType: 'option',
            link: ['is greater than', 'is less than'],
            type: 'number',
            valueLabelOptions: {
                'is greater than': 'minAmount',
                'is less than': 'maxAmount',
            },
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
 
    const [fetchingCsv, setFetchingCsv] = useState(false);

    const getTransactionsCsv = async (dateRange) => {
        try {
            const header = {
              headers: authHeader(),
              responseType: 'blob'
            }
            
            const store = await storeDetails()
            let url = `${baseUrl}/transactions/${store._id}/export/csv`

            if(filters && filters !== '') {
                url += `${url.includes('?') ? '&' : '?'}${filters}`
            }

            setFetchingCsv(true)
            const response =  await axios.get(url, header ) 
    
            const blob = new Blob([response.data], {type: "application/csv"})
            const receiptUrl = window.URL.createObjectURL(blob)
    
            var link = document.createElement('a');
            link.href = receiptUrl;
            link.download = `elevana-store-transactions-generated-${new Date().toDateString()}-${new Date().toLocaleTimeString()}.csv`;
            setTimeout(() => {
                link.click();
            }, 100);
            setFetchingCsv(false)

        } catch (error) {
            console.error(error)
            setFetchingCsv(false)
            dispatch({
                type: ERROR,
                error
            })
        }
    }

    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
  
    const performSearch =  debounce((term) => {
    //   setSearching(true)
    //   let results = searchArray(transactions, term)
    //   if(results) {
    //     setTransactions(results) 
    //   }
    //   else {
    //     setTransactions([])
    //   }
        setFilters()
        setTimeout(() => {
            setSearched(true)
            setSearching(false)
        }, 100);
    })

    return (
        <>
            <AppLayout pageTitle="Payments/Transactions">
            {loaded && 
                <div className='w-full min-h-screen h-inherit'>
                    {error && error!=='' &&  
                        <ErrorMessage message={error} dismissHandler={()=>{setError(false)}} />
                    }

                    <div className="w-full px-5 xl:px-12 py-4">
                        <div className='lg:flex flex-row justify-between items-center py-3 mb-1 xl:mb-5'>
                            <div className="w-full">
                                <h1 className='text-3xl font-bold text-ss-dark-gray'>Your Business Payments <span className='text-[14px] font-normal'>({ordersState.orders?.total || '0'} transactions)</span></h1>
                                <p className='text-gray-500 text-sm'>Manage payments for your business. Click on a payment to view details</p>

                            </div>

                            
                            <div className=' flex flex-row-reverse w-2/12'>
                                <button onClick={()=>{getTransactionsCsv()}} className='flex gap-x-2 items-center justify-center bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black font-[550]'>
                                    {fetchingCsv ? <InlinePreloader /> : 
                                    <span className='flex gap-x-2 items-center justify-center'>
                                        <ArrowUpTrayIcon className={`h-5 w-5`} />
                                        Export <span className='hidden xl:inline'>Transactions</span>
                                    </span>}
                                </button>
                            </div>
                        </div>

                        <div className='w-full flex items-start justify-between'>
                            <div className='w-full'>
                                <Filters filterOptions={filterOptions} returnSelected={(selectedFilters)=>{setFilters(selectedFilters)}} />
                            </div>
                            <div className='w-full lg:w-6/12 flex flex-row-reverse gap-x-4 items-center'>
                                <SearchField placeholderText={`Search for a transaction`} triggerSearch={(term) => performSearch(term)} />
                            </div>
                        </div>
                    </div>

                    {!transactionsState.fetchingTransactions ? <div className='w-full'>
                        <div className='px-6 xl:px-12 mt-5 xl:mt-12'>
                            {searching 
                                ? 
                                    <div className='px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center bg-black bg-opacity-20 rounded-lg mt-8'>
                                        <div className="w-6">
                                            <InlinePreloader />
                                        </div>
                                    </div>
                                : 
                                <>
                                    {searched && <button onClick={()=>{setRefresh(refresh+1)}} className='mt-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
                                        <CloseIcon className={`w-4 h-4`} /> Clear search
                                    </button>}

                                    <div className='hidden xl:block'>
                                        {transactionsState.transactions?.transactions?.length > 0 ?
                                            <DataTable
                                                tableHeaders={tableHeadersFields(cleanupData(transactionsState.transactions?.transactions)[0]).headers} 
                                                tableData={cleanupData(transactionsState.transactions?.transactions)} 
                                                columnWidths={transactionColumnWidths}
                                                columnDataStyles={columnDataStyles}
                                                allFields={tableHeadersFields(cleanupData(transactionsState.transactions?.transactions)[0]).fields}
                                                onSelectItems={getSelectionCount}
                                                tableOptions={tableOptions}
                                                pagination={{
                                                    perPage, 
                                                    currentPage,
                                                    totalItems: transactionsState.transactions?.total,
                                                }}
                                                changePage={updateCurrentPage}
                                                updatePerPage={updatePerPage}
                                            /> 
                                            :
                                            <EmptyState emptyStateText={`You have not received any payments on this platform yet`} emptyStateTitle={`No Payments Found`} />
                                        }
                                    </div>

                                    <div className='block xl:hidden pb-5'>
                                        {transactionsState.transactions?.transactions?.map((transaction, transactionIndex)=> (
                                            <div key={transactionIndex} className='rounded-lg shadow-xl shadow-ss-dark-blue/5 mb-5 bg-white'>
                                                <div className='w-full flex items-start justify-between gap-x-2.5 p-5 border-b'>
                                                    <div className='w-full'>
                                                        <TransactionLink type={transaction.order ? 'inflow' : 'outflow'} reference={transaction.transactionReference} index={transactionIndex} />
                                                    <p className='text-xs -mt-1.25 ml-12.5'>{new Date(transaction?.createdAt).toDateString()} - {new Date(transaction?.createdAt).toLocaleTimeString()}</p>
                                                    </div>
                                                    <div className='w-37.5 flex flex-row-reverse'>
                                                        <Currency amount={transaction.amount || 0}/>
                                                    </div>
                                                </div>
                                                <div className='w-full bg-green-50 bg-opacity-20 p-5'>
                                                    <p className='text-sm -mt-1.25 text-gray-500'>{transaction.order ? 'Received': 'Paid'} by <span className='text-gray-800 font-medium'>{transaction.createdBy?.name}</span> via {transaction.channel} for {transaction.order ? 'order' : 'subscription'} {transaction?.order?.alias}</p>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <Pagination
                                            pagination={{
                                            perPage: perPage, 
                                            currentPage: currentPage,
                                            totalItems: transactionsState.transactions?.total,
                                            }}
                                            changePage={setCurrentPage}
                                            updatePerPage={setPerPage}
                                        />
                                    </div>
                                    
                                </>
                            }
                        </div>
                    </div>
                    :
                    <Loader />
                    }
                </div>}

            </AppLayout>

            {/* <Transition appear show={transactionDialogOpen} as={Fragment}> */}
            {activeDialogTransaction !== null && <ModalDialog
                shown={transactionDialogOpen} 
                closeFunction={()=>{setTransactionDialogOpen(false)}} 
                actionFunction={()=>{}} 
                dialogTitle='Transaction Details'
                maxWidthClass='max-w-md'
            >
                    <TransactionDetails 
                        transaction={transactionsState.transactions?.transactions[activeDialogTransaction]} 
                        closeTransaction={()=>{closeTransaction()}} 
                    />
            </ModalDialog>}
        </>
    )
}

export default Payments