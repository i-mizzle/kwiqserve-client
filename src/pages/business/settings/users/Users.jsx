import React, { useEffect, useState } from 'react'
import { GET_USER_PROFILE } from '../../../../store/types';
import { fetchUsers } from '../../../../store/actions/usersActions';
import { debounce, searchArray, userDetails } from '../../../../utils';
import AppLayout from '../../../../components/Layouts/AppLayout';
import PlusIcon from '../../../../components/elements/icons/PlusIcon';
import { Link } from 'react-router-dom';
import SearchField from '../../../../components/elements/SearchField';
import Loader from '../../../../components/elements/Loader';
import CloseIcon from '../../../../components/elements/icons/CloseIcon';
import UserCard from '../../../../components/elements/UserCard';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../../../../components/elements/EmptyState';
import ModalDialog from '../../../../components/Layouts/ModalDialog';
import NewRole from '../../../../components/elements/roles/NewRole';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch()
  const usersState = useSelector((state => state.users))


  useEffect(() => {
    dispatch({
      type: GET_USER_PROFILE,
      payload: null
    })
    dispatch(fetchUsers())
    return () => {
      
    };
  }, [dispatch, refresh]);

  const [setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = debounce((term) => {
    setSearching(true)
    let results = searchArray(users, term)
    if(results) {
      setUsers(results) 
    }
    else {
      setUsers([])
    }
    setTimeout(() => {
      setSearched(true)
      setSearching(false)
    }, 100);
  })

  const [creatingRole, setCreatingRole] = useState(false)
  return (
    <>
      {<div className='min-h-screen w-full h-inherit'>
          {/* <div className='w-full'> */}
            <div className='w-full pb-6 mx-auto'>
              <div className='lg:flex justify-between items-center mb-4 w-full'>
                <div className='w-8/12'>
                  <h1 className='text-3xl font-bold text-ss-dark-gray'>System Users</h1>
                  <p className='text-gray-500 text-sm'>Please see details of your user account below. You can change any details you need to and click on "Update Profile" to save updates.</p>
                </div>
                
                <div className='w-4/12 flex flex-row-reverse'>
                  <Link to={`new-user`}>
                    <button className='w-full lg:w-max flex gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black font-[550]'>
                        <PlusIcon className={`h-5 w-5`} />
                      Onboard a new user
                    </button>
                  </Link>
                </div>
                
              </div>

              <div className='flex items-center justify-between'>
                  <div className='w-full lg:w-1/2 mt-5'>
                      <SearchField placeholderText={`Search for a user`} triggerSearch={(term) => performSearch(term)} />
                  </div>
              </div>

              {usersState?.loadingUsers ?
                <div className='xl:px-44 py-4 flex flex-row items-center justify-center gap-x-5 p-5 w-full text-xs text-center mt-8'>
                    <Loader />
                </div>
              :
              <>
                {searched && <button onClick={()=>{setRefresh(refresh+1)}} className='mt-5 px-3 py-2 border rounded border-gray-400 text-gray-600 text-sm w-max flex items-center gap-x-2'>
                    <CloseIcon className={`w-4 h-4`} /> Clear search
                </button>}
                {usersState.users?.users?.length > 0 ? 
                  <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 my-12'>
                    {usersState.users?.users?.map((entry, entryIndex)=>(
                      <div key={entryIndex}>
                      {/* {users.entryIndex} */}
                        <UserCard userDetails={entry} />
                      </div>
                    ))}
                  </div> : 
                  <div className='w-11/12 xl:w-6/12 mx-auto mt-12'>
                    <EmptyState emptyStateTitle={`No users created yet`} emptyStateText={`click on the "Onboard new user" button above to create a new user to manage this platform`} />
                  </div>
                }
              </>
              }

            </div>
        {/* </div> */}

      </div>}

      <ModalDialog
        shown={creatingRole} 
        closeFunction={()=>{setCreatingRole(false)}} 
        dialogTitle='Create a role'
        dialogIntro={`Create a new role for your users`}
        maxWidthClass='max-w-md'
      >
        <NewRole 
          close={()=>{setCreatingRole(false)}} 
          reload={()=>{setRefresh(refresh+1)}}
        />
      </ModalDialog>
    </>
  )
}

export default Users