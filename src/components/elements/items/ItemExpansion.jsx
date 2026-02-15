import React from 'react'
import { Link } from 'react-router-dom'
import ArrowNarrowRight from '../icons/ArrowNarrowRight'

const ItemExpansion = ({items, rowOpen}) => {
  return (
    <div className='w-full bg-white border-t border-gray-300 rounded-b-md py-6 px-12'>
        {items[rowOpen].variants && items[rowOpen].variants.length > 0 ? <>
            <h3 className='font-medium mb-4'>Variants of this Item</h3>
            {items[rowOpen].variants.map((variant, variantIndex) => (
                <div key={variantIndex} className='flex flex-row gap-x-4 justify-between my-3 hover:bg-gray-200 transition duration-200 py-2 rounded px-6 w-1/2'>
                    <div className='flex gap-x-2 items-start w-full'>
                        <div>
                            <p className='font-medium'>{variant?.name}</p>
                            {variant.barcode && <p className='font-medium text-sm'>{variant.barcode}</p>}
                            <p className='text-gray-500 text-sm'>{variant?.description}</p>
                        </div>
                    </div>
                    {/* <div className=' w-full'>
                        <p className='font-medium'>₦{(variant?.costPrice/100).toLocaleString()}<span className='font-thin'>/{variant.costUnit}</span><br />{variant?.storeStock} {variant.costUnit} in store</p>
                    </div> */}
                    <div className=' w-full'>
                        <p className={`text-sm text-gray-600`}>Current stock: {variant.currentStock || 0} {variant.type === 'sale' ? variant.saleUnit : variant.stockUnit }</p>
                    </div>
                    {/* <div className=' w-full'>
                        <p className='font-medium'>{variant?.sellingUnitsPerCostUnit} {variant.sellingUnit}/{variant.costUnit}</p>
                    </div> */}
                   
                </div>
            ))}
        </>

        :

        <div className='w-full py-3 text-center'>
            <p className='text-sm text-gray-400'>No variants for this item</p>
        </div>}
        <Link to={`/user/items/item/${items[rowOpen]._id}`} className='flex flex-row items-center gap-x-3 mt-5 hover:text-green-700 transition duration-200'>View/edit item details <ArrowNarrowRight className={`w-6 h-6`} /></Link>

    </div>
  )
}

export default ItemExpansion