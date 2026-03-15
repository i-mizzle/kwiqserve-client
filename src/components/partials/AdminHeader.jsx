import React from 'react'
import Logo from '../elements/Logo'
import UserMenu from './UserMenu'
import { authHeader, baseUrl, userDetails } from '../../utils'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ERROR } from '../../store/types'
import { useDispatch } from 'react-redux'
import axios from 'axios'

const AdminHeader = ({businessDetails}) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const getLinkClassName = (path) => {
    const isActive = location.pathname.includes(path)
    return `text-[15px]  ${isActive ? 'font-bold text-ss-dark-blue' : 'font-[400] text-gray-600'}`
  }

  const dispatch = useDispatch()

  const invalidateSession = async() => {
    try {
        const headers = authHeader()

        await axios.delete(`${baseUrl}/auth/sessions`, {headers})
        localStorage.removeItem('user')
        navigate('/')
      } catch (error) {
        console.log('error fetching business settings: ', error)
        dispatch({
          type: ERROR,
          error
        })
      }
  } 

  return (
    <header className='lg:px-12 xl:px-32 flex items-center justify-between py-2 bg-gray-50'>
        <Logo />

        <div className='w-full px-8 flex items-center gap-x-5'>
          <Link to={`/business/dashboard`} className={`${getLinkClassName('/business/dashboard')} flex items-center justify-center gap-x-2`}>
            {location.pathname.includes('/business/dashboard') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Dashboard
          </Link>
          <Link to={`/business/tables`} className={`${getLinkClassName('/business/tables')} flex items-center justify-center gap-x-2` }>
            {location.pathname.includes('/business/tables') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Tables
          </Link>
          <Link to={`/business/menus`} className={`${getLinkClassName('/business/menus')} flex items-center justify-center gap-x-2` }>
            {location.pathname.includes('/business/menus') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Menus
          </Link>
          <Link to={`/business/items`} className={`${getLinkClassName('/business/items')} flex items-center justify-center gap-x-2` }>
            {location.pathname.includes('/business/items') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Items
          </Link>
          <Link to={`/business/orders`} className={`${getLinkClassName('/business/orders')} flex items-center justify-center gap-x-2` }>
            {location.pathname.includes('/business/orders') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Orders
          </Link>
          <Link to={`/business/payments`} className={`${getLinkClassName('/business/payments')} flex items-center justify-center gap-x-2` }>
            {location.pathname.includes('/business/payments') && <span className='rounded-full bg-ss-dark-blue w-1 h-1 inline-block' />} Payments
          </Link>
        </div>

        <div className=' flex flex-row-reverse items-center gap-x-1 w-6/12'>
            <UserMenu businessDetails={businessDetails} userDetails={userDetails()} logOut={()=>{invalidateSession()}} />
            <h3 className='hidden lg:inline-block text-sm xl:text-md font-semibold mt-0.5 text-ss-dark-blue'>{businessDetails?.name}
            {/* <span className='py-2 px-3.75 ml-2.5 text-[12px] text-green-800 rounded bg-green-100 -mt-0.75 tracking-normal font-[550]'>{storeSubscription().subscriptionPlan.name}</span> */}
            </h3>

        </div>
    </header>
  )
}

export default AdminHeader