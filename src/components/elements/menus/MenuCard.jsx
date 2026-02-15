import React from 'react'
import { Link } from 'react-router-dom'
import ArrowNarrowRight from '../icons/ArrowNarrowRight'

const MenuCard = ({entry}) => {
    return (
        <div onClick={()=>{}} className={`cursor-pointer w-full rounded p-6 transition duration-200 bg-white border border-transparent hover:border-blue-200 hover:shadow-xl hover:shadow-blu-500/5 flex flex-row justify-between`}> 
            <div className="w-full">
                <p className={`font-medium text-lg text-gray-600 mb-3 pb-1 w-full border-b border-gray-300`}>{entry.name}</p>
                <p className={`font-medium text-sm text-gray-600 mb-3 pb-4 w-full border-b border-gray-300`}>{entry.description}</p>
                {entry.items.slice(0, 3).map((item, itemIndex)=>(
                    <div key={itemIndex}  className="my-3 relative">
                        <p className={`font-medium text-sm text-gray-600`}>{item.displayName}</p>
                        <p className={`text-sm text-gray-600`}>N{item.price}</p>
                    </div>
                ))}
                {entry.items.length > 3 && <p className='text-gray-500 font-medium text-sm'>{entry.items.length - 3} more items</p>}
                <Link to={`/business/menus/menu/${entry._id}`}>
                    <button className='text-sm flex flex-row items-center gap-x-3 mt-5 text-gray-700 hover:text-blue-700 transition duration-200'>See full menu <ArrowNarrowRight className={`w-6 h-6`} /></button> 
                </Link>
            </div>
        </div>
    )
}

export default MenuCard