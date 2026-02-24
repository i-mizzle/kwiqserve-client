import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PlusIcon from '../../../../components/elements/icons/PlusIcon'
import SearchField from '../../../../components/elements/SearchField'
import NewRole from '../../../../components/elements/roles/NewRole'
import ModalDialog from '../../../../components/Layouts/ModalDialog'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoles } from '../../../../store/actions/rolesPermissionsActions'
import Loader from '../../../../components/elements/Loader'
import EmptyState from '../../../../components/elements/EmptyState'
import ChevronIcon from '../../../../components/elements/icons/ChevronIcon'
import PencilSquareIcon from '../../../../components/elements/icons/PencilSquareIcon'
import TrashIcon from '../../../../components/elements/icons/TrashIcon'

const Roles = () => {
  const [creatingRole, setCreatingRole] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const rolesSelector = useSelector(state => state.roles)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  useEffect(() => {
    dispatch(fetchRoles('', page, perPage))
    return () => {
      
    }
  }, [dispatch, page, perPage])

  const [showingPermissions, setShowingPermissions] = useState(null)

  const togglePermissions = (roleIndex) => {
    if(showingPermissions === roleIndex){
      setShowingPermissions(null)
    } else {
      setShowingPermissions(roleIndex)
    }
  }
  
  return (
    <>
      {<div className='min-h-screen w-full h-inherit'>
        <div className='w-10/12 pb-6'>
          <div className='lg:flex justify-between items-center mb-4 w-full'>
            <div className='w-8/12'>
              <h1 className='text-3xl font-bold text-ss-dark-gray'>System Roles</h1>
              <p className='text-gray-500 text-sm'>Please see details of your user account below. You can change any details you need to and click on "Update Profile" to save updates.</p>
            </div>
            
            <div className='w-4/12 flex flex-row-reverse'>
              <button onClick={()=>{setCreatingRole(true)}} className='w-full lg:w-max flex gap-x-2 items-center justify-center mt-5 lg:mt-0 bg-ss-dark-blue border border-ss-dark-blue px-4 py-3 rounded-lg text-white transition duration-200 hover:bg-ss-black font-[550]'>
                <PlusIcon className={`h-5 w-5`} />
                Create a new role
              </button>
            </div>
            
          </div>

          <div className='flex items-center justify-between'>
            <div className='w-full lg:w-1/2 mt-5'>
              <SearchField placeholderText={`Search for a role`} triggerSearch={(term) => performSearch(term)} />
            </div>
          </div>

          {rolesSelector?.loadingRoles ? 
            <Loader />
            :
            <div className='w-full mt-10'>
              {rolesSelector?.roles?.roles?.length > 0 ?
                <>
                  {rolesSelector?.roles?.roles?.map((role, roleIndex)=>(<div key={roleIndex} className='p-5 relative'>
                    <div className='absolute top-5 right-5 flex flex-row-reverse items-center gap-x-2 w-20'>
                      <button className='p-1 rounded transition duration-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'>
                        <PencilSquareIcon className={`w-4 h-4`} />
                      </button>
                      <button className='p-1 rounded transition duration-200 text-gray-500 hover:text-red-800 hover:bg-red-50'>
                        <TrashIcon className={`w-4 h-4`} />
                      </button>
                    </div>
                    <h3 className='font-medium mb-1'>{role.name}</h3>
                    <p className='text-sm mb-2 text-gray-600'>{role.description}</p>
                    <div className='w-full'>
                      <div className='flex items-center gap-x-2'>
                        <p className='text-sm'>{role.permissions.length} permissions</p>
                        <button onClick={()=>{togglePermissions(roleIndex)}} className='flex items-center justify-between gap-x-2 text-[11px] font-medium px-2 py-1 rounded bg-gray-100 cursor-pointer'>
                          {showingPermissions === roleIndex ? 'Hide' : 'Show'} Permissions
                          <ChevronIcon className={`w-4 h-4 transition duration-200 ${showingPermissions === roleIndex ? 'rotate-270' : 'rotate-180'}`} />
                        </button>
                      </div>
                      {showingPermissions === roleIndex && 
                        <div className='w-full mt-4'>
                          <h3 className='text-[13px] text-gray-800 font-semibold pb-1 border-b w-max border-gray-400 mb-1'>Permissions allowed for this role</h3>
                          <p className='text-sm text-ss-dark-gray'>{role.permissions.join(', ')}</p>
                        </div>}
                    </div>
                  </div>))}

                </>
                :
                <EmptyState emptyStateText={`No roles found for your business. You can create a new role by clicking on "Create a new role" above`} emptyStateTitle={"No Roles FOund"} />
              }
            </div>
          }
        </div>
      </div>
      }

      <ModalDialog
        shown={creatingRole} 
        closeFunction={()=>{setCreatingRole(false)}} 
        dialogTitle='Create a role'
        dialogIntro={`Create a new role for your users`}
        maxWidthClass='max-w-xl'
      >
        <NewRole 
          close={()=>{setCreatingRole(false)}} 
          reload={()=>{setRefresh(refresh+1)}}
        />
      </ModalDialog>
    </>
  )
}

export default Roles