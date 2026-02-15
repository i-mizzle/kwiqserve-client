import React from 'react'
import PhotoIcon from '../icons/PhotoIcon'

const ItemSnippet = ({itemImage, itemName, itemDescription, barcode, category, showIcon}) => {
  return (
    <div className='flex items-center gap-x-3'>
        {showIcon && 
          <>
            {itemImage && itemImage !== '' ?
              <div className='w-12 h-12 rounded-sm' style={{
                backgroundImage: `url(" ${itemImage} ")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'none',
                backgroundPosition: 'center center'
              }} />
              :
              <PhotoIcon className={`w-12 h-12 p-3 rounded-sm text-gray-400 border border-gray-400 bg-gray-100`} />
            }
          </>
        }
        <div>
            <p className='font-medium text-gray-600 text-base'>{itemName}</p>
            {barcode && <p className='font-medium text-gray-6400 text-sm mt-1'>{barcode}</p>}
            <p className='font-medium text-gray-6400 text-sm mt-1'>{itemDescription}</p>
        </div>
    </div>
  )
}

export default ItemSnippet