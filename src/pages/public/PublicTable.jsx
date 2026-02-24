import React, { useEffect, useState, useRef } from 'react'
import TableLayout from '../../components/Layouts/TableLayout'
import { baseUrl, debounce, searchArray } from '../../utils'
import SearchField from '../../components/elements/SearchField'
import { fetchCategories } from '../../store/actions/categoriesActions'
import { useDispatch, useSelector } from 'react-redux'
import PublicCategoryCard from '../../components/elements/items/PublicCategoryCard'
import { ERROR } from '../../store/types'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../components/elements/Loader'
import PublicItemCard from '../../components/elements/items/PublicItemCard'
import EmptyState from '../../components/elements/EmptyState'
import CloseIcon from '../../components/elements/icons/CloseIcon'
import ArrowIcon from '../../components/elements/icons/ArrowIcon'

const PublicTable = () => {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const [tableDetails, setTableDetails] = useState(null)
  const categoriesSelector = useSelector((state => state.categories))
  const dispatch = useDispatch()
  const { tableId } = useParams()
  const cartSelector = useSelector((state => state.cart))
  
  useEffect(() => {
    dispatch(fetchCategories('', 0, 0))

    const fetchTableMenu = async (menuId) => {
      try {
        const headers = {
          "x-original-host": window && window.location.host 
        }
        setLoading(true)
        const response = await axios.get(`${baseUrl}/menus/${menuId}?expand=items.parentItem`, {headers})
        setMenu(response.data.data)
        setActiveItems(response.data.data.items)
        setLoading(false)
      } catch (error) {
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
        setTableDetails(response.data.data)
        fetchTableMenu(response.data.data.menu)
        // setLoading(false)
      } catch (error) {
        dispatch ({
          type: ERROR,
          error
        })
        setLoading(false)
      }
    } 

    fetchTableDetails()
  
    return () => {
      
    }
  }, [])

  const [searched, setSearched] = useState(false);
  const [activeItems, setActiveItems] = useState([]);

  const performSearch = debounce((term) => {
    setLoading(true)
    let results = searchArray(menu?.items.map((item)=>{return {...item, barcode: item?.item?.barcode}}), term)
    if(results) {
      setActiveItems(results) 
    }
    else {
      setActiveItems([])
    }
    setTimeout(() => {
      setSearched(true)
      setLoading(false)
    }, 100);
  })

  const clearSearch = () => {
    setLoading(true)
    setActiveItems(menu?.items)
    setSearched(false)
    setActiveCategory(false)
    setTimeout(() => {
        setLoading(false)
    }, 50);
  }

  const [activeCategory, setActiveCategory] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const categoryContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - categoryContainerRef.current.offsetLeft);
    setScrollLeft(categoryContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categoryContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fast
    categoryContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  return (
    <TableLayout>
      <div className='w-full px-4 bg-gray-50 min-h-screen h-inherit relative pb-0'>
        <h1 className='mt-5 text-5xl font-bold text-ss-dark-blue'>Place your<br /> order</h1>
        <p className='text-[13px] text-gray-600 mt-2'>Search for a product, or browse our categories to select and add items to your order. Once you checkout, your order will be brought to you at this table.</p>
        <div className='w-full my-4'>
          <SearchField placeholderText={`Search for an item`} />
        </div>

        <h3 className='text-xl mb-1 font-medium text-ss-dark-blue'>Categories</h3>
        <p className='text-[13px] text-gray-600'>Choose a category below to filter items</p>
        
        <div className='w-full mt-5'>
          {categoriesSelector.fetchingCategories ? 
            <div className='w-full h-50 flex items-center justify-center'>
              <InlinePreloader />
            </div>
            : 
              <div 
                ref={categoryContainerRef}
                className='relative flex items-center gap-x-2 flex-nowrap mb-5 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {categoriesSelector.categories?.categories !== null && categoriesSelector.categories?.categories?.length > 0 && categoriesSelector.categories.categories.map((category, categoryIndex) => (
                  <PublicCategoryCard
                    selectCategory={()=>{
                      setActiveCategory(categoryIndex)
                      performSearch(category._id)
                    }} 
                    category={category} 
                    key={categoryIndex} 
                    index={categoryIndex} 
                    activeCategory={activeCategory} 
                    deleteCategory={()=>{}}
                    hideDelete={true}
                  />
                ))}
              </div>
            }
        </div>
           
        {searched && <button onClick={()=>{clearSearch()}} className='mt-5 mb-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
            <CloseIcon className={`w-4 h-4`} /> Clear search
        </button>}

          <div className='w-full mt-5'>
            {loading  ? 
              <Loader />
            : 
            <div>
              {activeItems.length > 0 ? 
              <div className='relative grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-1'>
                {activeItems.map((item, itemIndex) => (
                  <PublicItemCard 
                    item={item}
                    itemStock={item?.item?.currentStock || 0} 
                    key={itemIndex} 
                    addToOrder={(item)=>{}}
                    canAddItem={true}
                    hideStock={false}
                    storeSettings={null}
                    currentPage={`storeFront`}
                  />
                ))}
              
            </div>
            :
            <div>
              <EmptyState emptyStateText={`No items found matching your search or selected category`} emptyStateTitle={`Nothing Found`} />  
            </div>}
          </div>}
        </div>

        {cartSelector?.cart && <div className='w-full p-3 shadow-lg shadow-ss-dark-blue/10 bg-white sticky bottom-0 left-0'>
          <Link to={`/tables/${tableId}/cart`} className='w-full flex items-center justify-between font-bold text-lg border-t border-gray-300 text-ss-pale-blue bg-ss-dark-blue p-4 rounded-lg'>
            <span>
              Complete your order <span className='text-sm font-normal'>({cartSelector?.cart?.items?.reduce((total, item) => total + item.quantity, 0)} items)</span>
            </span>
            <ArrowIcon className={`w-5 h-5`} />
          </Link>
        </div>}
      
      </div>
    </TableLayout>
  )
}

export default PublicTable