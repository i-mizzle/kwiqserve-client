import React from 'react'
import { Link } from 'react-router-dom'
import UserIcon from './icons/UserIcon'
import ArrowNarrowRight from './icons/ArrowNarrowRight'

const UserCard = ({userDetails}) => {
    return (
        <div onClick={()=>{}} className={`cursor-pointer w-full rounded p-6 transition duration-200 bg-white border border-transparent hover:border-blue-300 hover:bg-opacity-90 flex flex-row justify-between shadow-xl shadow-ss-pale-blue/15`}> 
            <div className="w-full">
                <UserIcon className={`w-12 h-12 p-3 rounded-sm text-gray-400 border border-gray-400 bg-gray-100`} />
                <p className={`mt-4 font-family-bricolage-grotesque! font-semibold text-xl text-gray-600 mb-3 pb-1 w-full border-b border-gray-300`}>{userDetails?.name}</p>
                <div  className="my-2 relative">
                    <p className={`font-medium text-sm text-ss-dark-gray mb-1`}>Username: {userDetails?.username}</p>
                    <p className={`font-medium text-sm text-ss-dark-gray mb-1`}>{userDetails?.email}</p>
                    <p className={`font-medium text-sm text-ss-dark-gray mb-1`}>{userDetails?.phone}</p>
                </div>

                <p className='text-gray-500 text-xs mt-4'>User Roles</p>
                <p className='text-ss-dark-gray text-[15px]'>{userDetails.businesses[0].roles.map(role => role.name).join(', ')}</p>
                {/* ))} */}
                <Link to={`/business/settings/users/user-details/${userDetails?._id}`} className='cursor-pointer'>
                    <button className='text-sm flex flex-row items-center gap-x-3 mt-5 text-ss-dark-blue hover:text-ss-black transition duration-200'>See user details <ArrowNarrowRight className={`w-6 h-6`} /></button> 
                </Link>
            </div>
        </div>
    )
}

export default UserCard