import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenus } from '../../../store/actions/menusActions';
import { Link } from 'react-router-dom';
import PlusIcon from '../../../components/elements/icons/PlusIcon';
import SearchField from '../../../components/elements/SearchField';
import EmptyState from '../../../components/elements/EmptyState';
import MenuCard from '../../../components/elements/menus/MenuCard';
import CloseIcon from '../../../components/elements/icons/CloseIcon';
import InlinePreloader from '../../../components/elements/InlinePreloader';
import { debounce } from '../../../utils';

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch()
  const menusState = useSelector((state => state.menus))

  useEffect(() => {
    setSearched(false)
    dispatch(fetchMenus())
    return () => {
      
    };
  }, [dispatch, refresh]);

  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = debounce((term) => {
    setSearching(true)
    let results = searchArray(menus, term)
    if(results) {
      setMenus(results) 
    }
    else {
      setMenus([])
    }
    setTimeout(() => {
      setSearched(true)
      setSearching(false)
    }, 100);
  })
  
  return (
    <AppLayout>
      <div className='min-h-screen h-inherit'>
          <div className='w-full lg:flex flex-row gap-x-8'>
              <div className='w-full pb-6 px-3 xl:px-12 mt-4 mx-auto'>
                <div className='lg:flex justify-between items-center mt-4 mb-4'>
                  <div className='w-6/12'>
                    <h1 className='text-3xl font-bold text-ss-dark-gray'>Menus</h1>
                    <p className='text-gray-500 text-sm'>Create and manage menus for your menu items. Click on a price card to view details or create a new one by clicking "Create a Menu"</p>
                  </div>
                    <Link to={`new-menu`}>
                       <button className='flex gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black w-full font-[550]'>
                          <PlusIcon className={`h-5 w-5`} />
                          Create a Menu
                        </button>
                    </Link>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='w-full xl:w-4/12'>
                        <SearchField placeholderText={`Search for a menu`} triggerSearch={(term) => performSearch(term)} />
                        {/* <input onChange={(e)=>{performSearch(e.target.value)}} type="text" className="py-2 px-4 block w-full focus:border-gray-800 focus:outline-none border border-gray-400 font-outfit placeholder:font-outfit" placeholder={`Search for a price card`} /> */}
                    </div>
                </div>
                {(searching || menusState.loadingMenus) ? 
                  <div className='px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center rounded-lg mt-8'>
                    <div className="w-6">
                        <InlinePreloader />
                    </div>
                  </div>
                : <>
                  {searched && <button onClick={()=>{setRefresh(refresh+1)}} className='mt-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
                      <CloseIcon className={`w-4 h-4`} /> Clear search
                  </button>}
                  {menusState.menus?.menus?.length > 0 ? <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-2 my-12'>
                    {menusState.menus?.menus.map((entry, entryIndex)=>(
                      <MenuCard key={entryIndex} entry={entry} />
                    ))}
                  </div> : 
                    <div className='w-6/12 mx-auto mt-12'>
                      <EmptyState emptyStateText={`click on the "Create a Menu" button above to create a new set of prices out of your items`} emptyStateTitle={`No menus found`} />
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
  )
}

export default Menus