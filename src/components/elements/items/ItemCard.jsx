import React, { useState } from 'react'
import ChevronIcon from '../icons/ChevronIcon'
import NumberField from '../form/NumberField';
import FormButton from '../form/FormButton';
import ModalDialog from '../../Layouts/ModalDialog';

const ItemCard = ({item, addToOrder, itemStock, canAddItem}) => {

  const [settingPrice, setSettingPrice] = useState(false);
  const [price, setPrice] = useState(0);
  return (
    <>
      <div className={`cursor-pointer w-full rounded-lg p-6 transition duration-200 bg-white hover:bg-opacity-70 hover:shadow-lg hover:shadow-green-500/10 border border-blue-100 shadow-lg shadow-ss-pale-blue/10`}> 
          <div className="flex flex-col justify-between gap-y-6">
            <div>
              <h3 className={`text-lg font-medium text-gray-600`}>{item.displayName}</h3>
              {item?.item?.barcode && item?.item?.barcode !== '' && <p className={`text-xs font-medium text-gray-600`}>Barcode: {`${item?.item?.barcode}`}</p>}
              <p className={`text-sm font-light mb-2 text-gray-600 capitalize flex items-center gap-x-1`}>
              {/* {unSlugify(item.section?.toLowerCase())} <ArrowNarrowRight className={`w-4 h-4 transform`} />  */}
              {/* {unSlugify(item.category.toLowerCase())} */}
              </p>
              {item.fixedPricing && <h3 className={`font-semibold text-gray-600`}>₦{(item.price).toLocaleString()}</h3>}
            </div>
            {/* <div className='xl:flex justify-between items-center'>
              <p className={`text-sm text-gray-600`}>{!item.item.noStock && <span>{itemStock}</span>} in stock</p>
              {canAddItem === true && <>
                {itemStock > 0 || item.item.noStock === true ? 
                <button onClick={()=>{
                  if(!item.fixedPricing){
                    setSettingPrice(true)
                    return
                  }
                  addToOrder(item)
                }} className='text-sm flex items-center justify-center gap-x-1 text-green-800 font-[550] bg-green-500 rounded px-2 py-1 bg-opacity-10 hover:bg-opacity-20'>
                  Add to order
                  <ChevronIcon className={`w-4 h-4 transform -rotate-90`} />
                </button>
                :
                  <span className='text-gray-300 text-xs'>Out of stock</span>
                } 
              </>}
            </div> */}
        </div>
      </div>

      <ModalDialog
        shown={settingPrice} 
        closeFunction={()=>{setSettingPrice(false)}} 
        dialogTitle={`Set price for ${item.displayName}`}
        maxWidthClass='max-w-md'
      >
        <div>
          <p className='text-sm'>This item has no fixed price on this price card so you need to add the price it is being sold for</p>
          <div className='mt-4'>
            <NumberField
              inputType="number" 
              fieldId={`item-price`}
              inputLabel="Price (N)" 
              hasError={false} 
              preloadValue={''}
              returnFieldValue={(value)=>{setPrice(value)}}
            />
          </div>

          <div className='mt-4 w-full'>
            {price > 0 && <FormButton buttonLabel="Set Price" buttonAction={()=>{
              addToOrder({...item, ...{price: price}})
              setSettingPrice(false)
            }} /> }
          </div>
        </div>
        
      </ModalDialog>
    </>
  )
}

export default ItemCard