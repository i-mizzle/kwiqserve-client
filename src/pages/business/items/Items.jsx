import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import ModalDialog from '../../../components/Layouts/ModalDialog'
import InlinePreloader from '../../../components/elements/InlinePreloader'
import SearchField from '../../../components/elements/SearchField'
import { Tooltip } from '@mui/material'
import ChevronIcon from '../../../components/elements/icons/ChevronIcon'
import CategoryCard from '../../../components/elements/items/CategoryCard'
import PlusIcon from '../../../components/elements/icons/PlusIcon'
import CloseIcon from '../../../components/elements/icons/CloseIcon'
import DataTable from '../../../components/elements/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import { debounce, tableHeadersFields, unSlugify } from '../../../utils'
import { Link } from 'react-router-dom'
import ItemExpansion from '../../../components/elements/items/ItemExpansion'
import Pagination from '../../../components/elements/Pagination'
import CreateNewCategory from '../../../components/elements/items/CreateNewCategory'
import { clearDeletedCategory, fetchCategories } from '../../../store/actions/categoriesActions'
import { fetchItems } from '../../../store/actions/itemsActions'
import ItemSnippet from '../../../components/elements/items/ItemSnippet'
import ArrowNarrowRight from '../../../components/elements/icons/ArrowNarrowRight'

const Items = () => {
    const [refresh, setRefresh] = useState(0);
    const [creatingNewCategory, setCreatingNewCategory] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(50);
    const [itemFilter, setItemFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const dispatch = useDispatch()
    // const statsState = useSelector((state => state.stats))
    const categoriesState = useSelector((state => state.categories))
    const itemsState = useSelector((state => state.items))
    const [filter, setFilter] = useState('');

    const performSearch =  debounce((term) => {
        setFilter(`name=${term}`)
    })
    
    useEffect(() => {
        setSearched(false)
        // dispatch(fetchStats())
        dispatch(fetchCategories(categoryFilter, 0, 0))
        dispatch(fetchItems(itemFilter, currentPage, perPage))
        // dispatch(pullData('item', filter, currentPage, perPage))

        if(categoriesState.deletedCategory !== null){
        dispatch(clearDeletedCategory())
        dispatch({
            type: SUCCESS,
            payload: 'Item/Category deleted successfully!'
        })
        }
        return () => {
        
        };

    }, [refresh, categoriesState.deletedCategory, currentPage, perPage, itemFilter, categoryFilter, dispatch, filter]);

    const columnWidths = {
        sku: "w-full lg:w-1/12",
        item: "w-full lg:w-5/12",
        category: 'w-full lg:w-3/12',
        variants: "w-full lg:w-1/12",
        '': "w-2/12"
        // storeStock: "w-full lg:w-2/12",
        // storeFrontStock: "w-full lg:w-2/12"
    }

    const cleanupData = (dataSet) => {
        const data = []
        if(!dataSet) return []
        dataSet.forEach((item, itemIndex) => {
        data.push(
            {
            sku: item?.sku,
            item: <ItemSnippet 
                itemImage={item.coverImage || ''} 
                section={item?.section} 
                category={item?.category} 
                showIcon={true} 
                itemName={item?.name} 
                itemDescription={item?.description} 
            />,
            category: <p className={`text-sm font-light mt-2 text-gray-600 capitalize flex items-center gap-x-1`}>
                {unSlugify(item?.category.map(cat => cat?.name?.toLowerCase())?.join(', '))}
                </p>,
            variants: `${item?.variants ? item?.variants?.length : 'No '} variant${item?.variants?.length > 1 ? 's' : ''}`,
            '': <Link to={`/business/items/item/${item._id}`} className='flex flex-row items-center gap-x-2 text-sm hover:text-blue-700 transition duration-200'>View/edit item details <ArrowNarrowRight className={`w-6 h-6`} /></Link>
            
            // storeStock: 0,
            // storeFrontStock: 0,
            // storeStock: item.variants.reduce((a, b) => a + (b.storeStock || 0), 0).toLocaleString() + ' ' + item.variants[0].costUnit,
            // storeFrontStock: item.variants.reduce((a, b) => a + (b.storeFrontStock || 0), 0).toLocaleString() + ' ' + item.variants[0].sellingUnit,
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
        expandable: false,
        clickableRows: true,
        rowAction: (value)=>{toggleRowOpen(value)}
    }

    const [activeSection, setActiveSection] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCategories, setShowCategories] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const doDeleteCategory = async (id, name) => {
        setDeleteConfirmationMessage(`You are about to permanently delete the category ${name}. This action cannot be reversed. Please confirm.`)
        setCategoryToDelete(id)
        setTimeout(() => {
        setShowDeleteConfirmation(true)
        }, 100);
    }

    const deleteAfterConfirm = () => {
        dispatch(deleteCategory(categoryToDelete))
        setShowDeleteConfirmation(false)
        setTimeout(() => {
            setDeleteConfirmationMessage(null)
        }, 50);
    }

    const [searched, setSearched] = useState(false);

    return (
        <>
            <AppLayout>
                {/* {statsState.fetchingStats ? 
                    <div className='w-full h-[200px] flex items-center justify-center'>
                    <InlinePreloader />
                    </div>
                :  */}
                <div className='min-h-screen h-inherit'>
                    <div className='w-full lg:flex flex-row gap-x-8'>
                        <div className='w-full pb-6 px-4 lg:px-8 mt-4'>
                        <div className='lg:flex justify-between items-center mt-6 mb-4'>
                            <div className='w-full lg:w-1/2'>
                                <h1 className='text-3xl font-bold text-ss-dark-gray'>Items/Products </h1>
                                <p className='text-gray-500 text-sm'>A list of all products/items you sell at your establishment. you can click an item for details and you can add a new item but clicking on "Create new item"</p>
                            </div>

                            {<Link to={`new-item`}>
                                <button className='flex gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black w-full font-[550]'>
                                <PlusIcon className={`h-5 w-5`} />
                                Create a new Item
                                </button>
                            </Link>}
                        </div>
                        
                        <div className='w-full bg-white rounded-lg pb-3 border-b border-gray-300'>
                            <div className='w-full flex justify-between items-center transition duration-200 cursor-pointer rounded-r-full' onClick={()=>{setShowCategories(!showCategories)}}>
                                <div>
                                    <h3 className='text-lg text-gray-700 font-[550]'>Item Categories</h3>
                                    <p className='text-sm text-gray-500'>Click this section to view item categories and/or create new categories</p>
                                </div>
                                <Tooltip title="Collapse categories" placement="left">
                                    <span className=' p-3 bg-gray-100 rounded-full'>
                                        <ChevronIcon className={`w-5 h-5 text-gray-500 transform transition duration-200 ${!showCategories ? 'rotate-90' : '-rotate-90'}`} />
                                    </span>
                                </Tooltip>
                            </div>

                            {showCategories &&
                            <div className='mt-5'>
                                {categoriesState.fetchingCategories ? 
                                <div className='w-full h-50 flex items-center justify-center'>
                                    <InlinePreloader />
                                </div>
                                : 
                                <div className='relative grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-1 mb-5'>
                                    <div 
                                    onClick={()=>{
                                        setActiveCategory(null)
                                        setItemFilter(``)
                                        }} 
                                    className={`${activeCategory === null ? 'bg-ss-dark-blue hover:bg-ss-black' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer w-full rounded-lg p-6 transition duration-200 bg-gray-100 hover:bg-gray-200`}
                                    > 
                                    <div className="flex flex-col justify-between gap-y-12">
                                        <div className={`text-right `}>
                                        {/* <button onClick={()=>{deleteCategory()}} className={`${activeCategory === index ? 'text-white' : 'text-gray-600'}`}>
                                            <TrashIcon className={`w-5 h-5`} />
                                        </button>  */}
                                        </div>
                                        <p className={`font-medium text-gray-600 ${activeCategory === null ? 'text-white' : 'text-gray-600'}`}>All Categories</p>
                                    </div>
                                    </div>
                                    {categoriesState.categories?.categories !== null && categoriesState.categories?.categories?.length > 0 && categoriesState.categories.categories.map((category, categoryIndex) => (
                                        <CategoryCard 
                                            selectCategory={()=>{
                                            setActiveCategory(categoryIndex)
                                            setItemFilter(`category=${category._id}`)
                                            }} 
                                            category={category} 
                                            key={categoryIndex} 
                                            index={categoryIndex} 
                                            activeCategory={activeCategory} 
                                            deleteCategory={()=>{doDeleteCategory(category._id, category.name)}}
                                        />
                                    ))}
                                    <div onClick={()=>{setCreatingNewCategory(true)}} className={`cursor-pointer w-full rounded-lg p-6 transition duration-200 bg-gray-200 hover:bg-gray-300`}> 
                                        <div className="flex flex-col justify-between gap-y-12">
                                            <p className={`font-medium text-gray-600`}><PlusIcon className={`w-7 h-7`} /> </p>
                                            <p className={`font-thin text-sm text-gray-600`}>Create new category</p>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            }
                        </div>

                        <div className='lg:flex items-center justify-between my-5'>
                            <div className='w-full lg:w-4/12'>
                                
                            </div>
                            <div className='w-full lg:w-4/12 mt-5 lg:mt-0'>
                                <SearchField placeholderText={`Search for an item/product`} triggerSearch={(term) => performSearch(term)} />
                                {/* <input onChange={(e)=>{performSearch(e.target.value)}} type="text" className="py-2 px-4 block w-full focus:border-gray-800 focus:outline-none border border-gray-400 font-outfit placeholder:font-outfit" placeholder={`Search for an item/product`} /> */}

                            </div>
                        </div>

                        
                        {!itemsState.loadingItems ? <div className='w-full'>
                                {searched && <button onClick={()=>{setRefresh(refresh+1)}} className='mt-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
                                <CloseIcon className={`w-4 h-4`} /> Clear search
                                </button>}
                                <span className='hidden xl:block'>
                                    <DataTable
                                        tableHeaders={tableHeadersFields(cleanupData(itemsState.items?.items)[0]).headers} 
                                        tableData={cleanupData(itemsState.items?.items)} 
                                        columnWidths={columnWidths}
                                        columnDataStyles={{}}
                                        allFields={tableHeadersFields(cleanupData(itemsState.items?.items)[0]).fields}
                                        onSelectItems={()=>{}}
                                        tableOptions={tableOptions}
                                        pagination={{
                                            perPage: perPage, 
                                            currentPage: currentPage,
                                            totalItems: itemsState.items?.total,
                                        }}
                                        changePage={setCurrentPage}
                                        updatePerPage={setPerPage}
                                        // expandedIndex={rowOpen || ''}
                                        // expansion={<ItemExpansion items={itemsState.items?.items} rowOpen={rowOpen} />}
                                    /> 
                                </span>

                                <span className='xl:hidden'>
                                {itemsState.items?.items?.map((item, itemIndex) => (
                                    <Link to={`item/${item._id}`} key={itemIndex} className='w-full relative flex items-start justify-between mb-5 gap-x-2.5 bg-white my-2.5 p-2.5 rounded-lg shadow-xl shadow-ss-dark-blue/5'>
                                    <div className='flex items-center gap-x-2.5 w-full'>
                                        <div className='w-18.75 flex items-center justify-center bg-gray-50 h-18.75'>
                                            {item.coverImage ? <div className='w-18.75 h-18.75 rounded-lg' style={{
                                                backgroundImage: `url("${item.coverImage}")`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center center',
                                            }} /> :
                                                <PhotoIcon className={`w-10 h-10 text-gray-200`} />
                                            }
                                        </div>
                                        <div>
                                            <h3 className='text-[15px] font-[550] text-gray-700'>{item.name}</h3>
                                            <p className='text-sm text-gray-500'>{item.description}</p>
                                            <p className={`text-sm font-light mt-2 text-gray-600 capitalize flex items-center gap-x-1`}>
                                                {unSlugify(item?.category?.map(cat => cat?.name?.toLowerCase())?.join(', '))}
                                            </p>
                                        </div>
                                    </div>
                                    <span className='px-1.25 py-1.25 w-20 absolute top-0.5 right-1.25 rounded bg-gray-50 text-xs font-semibold text-gray-500'>{item.variants.length} variants</span>
                                    </Link>
                                ))}
                                <Pagination
                                    pagination={{
                                        perPage: perPage, 
                                        currentPage: currentPage,
                                        totalItems: itemsState.items?.total,
                                    }}
                                    changePage={setCurrentPage}
                                    updatePerPage={setPerPage}
                                />
                                </span>
                                
                            </div> 
                        : 
                            <div className='w-full flex items-center justify-center h-50'>
                                <InlinePreloader />
                            </div>
                        }
                        </div>
                    </div>

                </div>
            </AppLayout>

            <ModalDialog
                shown={creatingNewCategory} 
                closeFunction={()=>{setCreatingNewCategory(false)}} 
                dialogTitle='Create a category'
                dialogIntro={`Create a category for store or sale items`}
                maxWidthClass='max-w-lg'
            >
                <CreateNewCategory 
                    closeNewCategory={()=>{setCreatingNewCategory(false)}} 
                    reload={()=>{setRefresh(refresh+1)}}
                />
            </ModalDialog>
        </>
    )
}

export default Items