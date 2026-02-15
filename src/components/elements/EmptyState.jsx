import React from 'react'
import FolderIcon from './icons/FolderIcon'

const EmptyState = ({emptyStateTitle, emptyStateText}) => {
  return (
    <div className='py-4 flex items-center justify-center'>
        <div className='w-full text-center p-5 mt-12'>
            <FolderIcon className={`w-12 h-12 text-blue-100 mx-auto`} />
            {emptyStateTitle && <h3 className="w-full text-[15px] text-gray-700 font-[550] text-center mt-2">{emptyStateTitle}</h3>}
            {emptyStateText && <p className="w-full text-sm text-gray-500 font-[550] text-center mt-1">{emptyStateText}</p>}
        </div>
    </div>
  )
}

export default EmptyState