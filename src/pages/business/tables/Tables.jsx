import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import { clearCreatedTable, fetchTables } from '../../../store/actions/tablesActions';
import { useDispatch, useSelector } from 'react-redux';
import SearchField from '../../../components/elements/SearchField';
import PlusIcon from '../../../components/elements/icons/PlusIcon';
import { Link } from 'react-router-dom';
import InlinePreloader from '../../../components/elements/InlinePreloader';
import EmptyState from '../../../components/elements/EmptyState';
import NewTable from '../../../components/elements/tables/NewTable';
import ModalDialog from '../../../components/Layouts/ModalDialog';
import ArrowNarrowRight from '../../../components/elements/icons/ArrowNarrowRight';
import TrashIcon from '../../../components/elements/icons/TrashIcon';
import MultipleNewTables from '../../../components/elements/tables/MultipleNewTables';
import SquaresIcon from '../../../components/elements/icons/SquaresIcon';
import SquaresStackedIcon from '../../../components/elements/icons/SquaresStackedIcon';
import Pagination from '../../../components/elements/Pagination';

const Tables = () => {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)

    const dispatch = useDispatch()
    const tablesSelector = useSelector(state => state.tables)
    const [refresh, setRefresh] = useState(0)
    const [searched, setSearched] = useState(false)
    useEffect(() => {
        setSearched(false)
        dispatch(fetchTables(``, page, perPage))
        
        if(tablesSelector.createdTable && tablesSelector.createdTable !== null) {
            setCreatingTable(false)
            setCreatingMultipleTables(false)
            dispatch(clearCreatedTable())
        }
        return () => {
            
        };
    }, [dispatch, refresh, page, perPage, tablesSelector.createdTable]);

    const [creatingTable, setCreatingTable] = useState(false)
    const [creatingMultipleTables, setCreatingMultipleTables] = useState(false)
    return (
        <>
            <AppLayout>
                <div className='min-h-screen h-inherit'>
                    <div className='w-full lg:flex flex-row gap-x-8'>
                        <div className='w-full pb-6 px-3 xl:px-12 mt-4 mx-auto'>
                            <div className='lg:flex justify-between items-center mt-4 mb-4'>
                                <div className='w-6/12'>
                                    <h1 className='text-3xl font-bold text-ss-dark-gray'>Tables</h1>
                                    <p className='text-gray-500 text-sm'>Create and manage menus for your menu items. Click on a price card to view details or create a new one by clicking "Create a Menu"</p>
                                </div>
                                <div className='flex flex-row-reverse gap-x-2'>

                                    <button onClick={()=>{setCreatingTable(true)}} className='flex w-max gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black cursor-pointer font-[550]'>
                                        <PlusIcon className={`h-5 w-5`} />
                                        Create a Table
                                    </button>
                                    <button onClick={()=>{setCreatingMultipleTables(true)}} className='flex w-max gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-pale-blue border border-ss-dark-blue px-4 py-3 rounded-lg transition duration-200 hover:bg-blue-200 cursor-pointer font-[550] text-ss-dark-blue'>
                                        <SquaresStackedIcon className={`h-5 w-5`} />
                                        Create Multiple Tables
                                    </button>
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div className='w-full xl:w-4/12'>
                                    <SearchField placeholderText={`Search for a table`} triggerSearch={(term) => performSearch(term)} />
                                    {/* <input onChange={(e)=>{performSearch(e.target.value)}} type="text" className="py-2 px-4 block w-full focus:border-gray-800 focus:outline-none border border-gray-400 font-outfit placeholder:font-outfit" placeholder={`Search for a price card`} /> */}
                                </div>
                            </div>
                            {(tablesSelector.loadingTables) ? 
                            <div className='px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center rounded-lg mt-8'>
                                <div className="w-6">
                                    <InlinePreloader />
                                </div>
                            </div>
                            : <>
                            {searched && <button onClick={()=>{setRefresh(refresh+1)}} className='mt-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
                                <CloseIcon className={`w-4 h-4`} /> Clear search
                            </button>}
                            {tablesSelector.tables?.tables?.length > 0 ? 
                            <>
                                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 my-12'>
                                    {tablesSelector.tables?.tables.map((table, tableIndex)=>(
                                        // <MenuCard key={entryIndex} entry={entry} />
                                        <div key={tableIndex} className='w-full bg-gray-50'>
                                            <div className='p-5 border-b border-gray-300'>
                                                <h3 className='font-medium text-xl'>{table.name}</h3>
                                                <h3 className='uppercase tracking-[0.5em] text-xs mb-2'>{table.code}</h3>
                                                <div className='h-12.5'>
                                                    <p className='text-sm text-gray-500'>{table.description.substr(0,100)}{table.description.length > 100 ? '...' : ''}</p>
                                                </div>
                                            </div>
                                            <div className='px-5 pt-2 pb-5 flex items-center justify-between'>
                                                <Link to={`/business/tables/table/${table._id}`} className='flex text-sm items-center gap-x-2 font-family-bricolage-grotesque! text-ss-dark-gray hover:text-blue-700 transition duration-200'>
                                                    See table details
                                                    <ArrowNarrowRight className={`w-4 h-4`} />
                                                </Link>

                                                <button className='p-1 bg-transparent rounded hover:bg-red-500/10 text-ss-dark-gray hover:text-red-600 transition duration-200 cursor-pointer'>
                                                    <TrashIcon className={`w-4.5 h-4.5`} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div> 
                                <div className='w-full'>
                                    <Pagination
                                        pagination={{
                                            perPage: perPage, 
                                            currentPage: page,
                                            totalItems: tablesSelector.tables?.total,
                                        }}
                                        changePage={setPage}
                                        updatePerPage={setPerPage}
                                    />
                                </div>
                                </>
                                : 
                                <div className='w-6/12 mx-auto mt-12'>
                                    <EmptyState 
                                        emptyStateText={`Click on the "Create a Table" button above to create a new table`} 
                                        emptyStateTitle={`No tables found`} 
                                    />
                                </div>
                            }
                            </>}

                        </div>

                        {/* <div className='w-full lg:w-3/12 bg-gray-100 h-screen px-10 py-5 xl:fixed right-0'>
                            <h3 className='font-medium text-lg text-gray-700'>Inventory Stats</h3>
                            <p className='text-sm mt-2 text-gray-500 mb-4'>Item sales (top 10 items) <br />Use the dropdown to select item section</p>
                        </div> */}
                    </div>

                </div>
            </AppLayout>

            <ModalDialog
                shown={creatingTable} 
                closeFunction={()=>{setCreatingTable(false)}} 
                dialogTitle='Create a new table'
                // dialogIntro={`Create a category for store or sale items`}
                maxWidthClass='max-w-lg'
            >   
                <NewTable />
            </ModalDialog>

             <ModalDialog
                shown={creatingMultipleTables} 
                closeFunction={()=>{setCreatingMultipleTables(false)}} 
                dialogTitle='Create new tables'
                // dialogIntro={`Create a category for store or sale items`}
                maxWidthClass='max-w-lg'
            >   
                <MultipleNewTables />
            </ModalDialog>
        </>
    )
}

export default Tables